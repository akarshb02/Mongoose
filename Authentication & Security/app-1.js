require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const ejs = require('ejs')
const md5 = require('md5');
const encry = require('mongoose-encryption')
const mongoode = require('mongoose')
app.use(express.static("public"))
mongoode.connect("mongodb://localhost:27017/userDB", { useUnifiedTopology: true, useNewUrlParser: true })
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view-engine', 'ejs');
console.log(process.env.SEC);
const userSchema = new mongoode.Schema({
    email: String,
    password: String
});


const User = new mongoode.model("User", userSchema);
userSchema.plugin(encry, { secret: process.env.SEC, encryptedFields: ["password"] });


app.get("/", function(req, res) {
    res.render("home.ejs");
});
app.get("/login", function(req, res) {
    res.render("login.ejs");
});
app.get("/register", function(req, res) {
    res.render("register.ejs");
});

app.post("/register", function(req, res) {
    const udata = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    udata.save(function(err) {
        if (!err) {
            console.log("success");
            res.render("secrets.ejs")
        } else {
            console.log("Failure");
        }
    });


})
app.post("/login", function(req, res) {

    const username = req.body.username;
    const psw = md5(req.body.password);

    User.findOne({ email: username }, function(err, name) {
        if (err) {
            console.log(err);
        } else {
            if (name) {
                if (name.password === psw) {

                    res.render("secrets.ejs")

                }
            }


        }


    })

});


app.listen(600, function() {
    console.log("Server started ");
})