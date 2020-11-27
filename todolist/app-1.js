const express = require("express");
const app = express();
var items = ["", "Cook Food", "Eat Food"];
const mongoose = require('mongoose');
app.set("view-engine", "ejs");

const bodyParser = require("body-parser");
const e = require("express");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var today = new Date();
mongoose.connect("mongodb://localhost:27017/todolistdb", { useUnifiedTopology: true, useNewUrlParser: true })





app.get("/", function(req, res) {

    Todo.find({},
        function(err, foundItems) {

            if (defaultItems.length === 0) {
                Todo.insertMany(defaultItems, function(err) {

                    if (err) {
                        console.log(err);
                    } else {
                        console.log("data added successfully");
                    }
                });



                res.redirect("/");
            } else {


                res.render('list-1.ejs', { kindOfDay: today, newLists: foundItems })
            }


        });


});







//var day1 = today.toLocaleDateString("en-US", option);

app.post("/", function(req, res) {

    var item = req.body.newItem;

    items.push(Todo);




    res.redirect("/");

});
const dbtodo = {
    name: String
};
const Todo = mongoose.model("todolist", dbtodo);

const t1 = new Todo({
    name: "Buy Food"
})
const t2 = new Todo({
    name: "Cook Food"
})
const t3 = new Todo({
    name: "Eat Food"
});
const defaultItems = [t1.name, t2.name, t3.name];








app.listen(1000, function() {

    console.log("server started");
});