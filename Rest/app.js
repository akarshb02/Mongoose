const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose')

app.use(bodyParser.urlencoded({ extended: true }));
const results = [];
app.set('view-engine', 'ejs')

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true })

const wikiSchema = new mongoose.Schema({

    title: String,
    content: String
});

const wiki = mongoose.model("articles", wikiSchema);

app.route('/articles')
    .get(function(req, res) {

        wiki.find({}, function(err, results) {
            if (!err) {
                res.send(results);
            } else {
                res.send(err);
            }

        });
    })



.post(function(req, res) {

        const data1 = new wiki({

            title: req.body.title,
            content: req.body.content
        })

        data1.save(function(err) {
            if (!err) {
                res.send("Successfully added a new article");
            } else {
                res.send(err);
            }
        });


    })
    .delete(function(req, res) {

        wiki.deleteMany({}, function(err) {

            if (err) {
                res.send(err);
            } else {
                res.send("success");
            }

        })

    });
app.route("/articles/:articleTitle")

.get(function(req, res) {

        const userSearch = req.params.articleTitle;
        wiki.findOne({ title: userSearch }, function(err, found) {
            if (found) {
                res.send(found);
            } else {
                res.send("Try Again....!");
            }
        })

    })
    .put(function(req, res) {
        wiki.update({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content }, { overwrite: true }, function(err) {
            if (err) {
                res.send("error");
            } else {
                res.send("Successfully Updated");
            }
        })

    })
    .patch(function(req, res) {
        wiki.updateOne({ title: req.params.articleTitle }, { $set: req.body }, function(err) {
            if (err) {
                res.send("error");
            } else {
                res.send("Successfully Updated");
            }
        })
    })
    .delete(function(req, res) {
        wiki.deleteOne({ title: req.params.articleTitle }, function(err) {
            if (err) {
                res.send("error");
            } else {
                res.send("Successfully Deleted");
            }
        })
    })



app.listen(200, function() {
    console.log("Server Started Successfully");
});