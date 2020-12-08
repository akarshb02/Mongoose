require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const ejs = require('ejs')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require("passport-local-mongoose")
const encry = require('mongoose-encryption')
const mongoode = require('mongoose');
const { use, Strategy } = require('passport');
const findOrCreate = require('mongoose-findorcreate')
const FacebookStrategy = require("passport-facebook")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view-engine', 'ejs');






app.use(session({

    secret: process.env.SEC,
    resave: false,
    saveUninitialized: true,


}));
app.use(passport.initialize());
app.use(passport.session());


mongoode.connect("mongodb://localhost:27017/userDB", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });


console.log(process.env.SEC);

const userSchema = new mongoode.Schema({
    email: String,
    password: String,
    googleId: String,
    facebookId: String
});

userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)

const User = new mongoode.model("User", userSchema);
//userSchema.plugin(encry, { secret: process.env.SEC, encryptedFields: ["password"] });
passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:11/auth/google/secrets"

    },
    function(request, accessToken, refreshToken, profile, done) {
        User.findOrCreate({ googleId: profile.id }, function(err, user) {
            return done(err, user);
        });
    }
));


passport.use(new FacebookStrategy({
        clientID: process.env.APP_ID,
        clientSecret: process.env.APP_SECRET,
        callbackURL: "http://localhost:120/auth/facebook/secrets"
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ facebookId: profile.id }, function(err, user) {
            return cb(err, user);
        });
    }
));




app.get("/", function(req, res) {
    res.render("home.ejs");
});

app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
);

app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ["user_friends"] }));


app.get('/auth/google/secrets',
    passport.authenticate('google', {
        successRedirect: '/secrets',
        failureRedirect: '/login'
    }));

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/secrets',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/secrets');
    });


app.get("/secrets", function(req, res) {

    if (req.isAuthenticated()) {
        res.render("secrets.ejs");
    } else {
        res.redirect("/login")
    }
});
app.get("/login", function(req, res) {
    res.render("login.ejs");
});
app.get("/register", function(req, res) {
    res.render("register.ejs");
});
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/")
})


app.post("/register", function(req, res) {

    User.register({ username: req.body.username }, req.body.password, function(err, result) {

        if (err) {
            console.log(err);
            res.redirect("/register")
        } else {
            passport.authenticate('local')(req, res, function() {
                res.redirect("/secrets")
            })
        }

    });


});
app.post("/login", function(req, res) {

    const user = new User({
        username: req.body.username,
        password: req.body.password

    });
    req.login(user, function(err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate('local')(req, res, function() {
                res.redirect("/secrets")
            })
        }
    })


});





app.listen(120, function() {
    console.log("Server started ");
})