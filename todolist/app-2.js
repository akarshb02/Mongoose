const express = require("express");
const app = express();
const mongoose = require('mongoose');
app.set("view-engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
var _ = require('lodash');

mongoose.connect("mongodb+srv://admin:Akarsh123@cluster0.h9fjl.mongodb.net/todolistdb?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true })

const itemschema = {

    name: String
}
const item = mongoose.model("Item", itemschema);
const item1 = new item({
    name: "Morning"
});
const item2 = new item({
    name: "Afternoon"
});

const item3 = new item({
    name: "Evening"
});

const arr = [item1, item2, item3]

const listSchema = {
    name: String,
    items: [itemschema]
}

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

    item.find({}, function(err, found) {
        if (found.length === 0) {
            item.insertMany(arr, function(err) {
                if (err) {
                    console.log("error");
                } else {
                    console.log("successfully saved arr items to database ");
                }
            });

            res.redirect("/")

        } else {
            res.render("list-2.ejs", { kindOfDay: "Today", newLists: found })
        }
    });
});

app.post("/", function(req, res) {

    const itemName = req.body.newItem;

    const listName = req.body.sub;
    const newit = new item({

        name: itemName

    });
    if (listName === "Today") {
        newit.save();
        res.redirect("/")
    } else {
        List.findOne({ name: listName }, function(err, found_data) {
            found_data.items.push(newit)
            found_data.save();

            res.redirect("/" + listName)

        });

    }

});

app.post("/delete", function(req, res) {

    const checkedId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        item.findOneAndDelete(checkedId, function(err) {
            if (err) {
                console.log("error");
            } else {
                console.log("successfully deleted");
                res.redirect("/")
            }
        });
    } else {

        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedId } } }, function(err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        })


    }
})

app.get("/:day1", function(req, res) {
    const day1 = _.capitalize(req.params.day1);
    List.findOne({ name: day1 }, function(err, foundList) {

        if (!foundList) {
            const list = new List({
                name: day1,
                items: arr
            });
            list.save();
            res.redirect("/" + day1)

        } else {
            res.render("list-1.ejs", { kindOfDay: foundList.name, newLists: foundList.items })
        }

    });
})

let port = process.env.PORT;
if (port === null || port === "") {
    port(10);
}
app.listen(port);

app.listen(port, function() {

    console.log("server started");
});