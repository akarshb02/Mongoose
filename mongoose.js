const MongoClient = require("mongodb").MongoClient;
const assert = require('assert');
const mongoose = require('mongoose');




mongoose.connect("mongodb://localhost:27017/fruitsDB", { useNewUrlParser: true, useUnifiedTopology: true });

const FruitSchema = new mongoose.Schema({

    name: String,
    rating: {
        type: Number,
        min: 1,
        max: 10
    },
    review: String
});


const Fruit = mongoose.model("other", FruitSchema);

const fruit = new Fruit({
    name: "Apple",
    rating: 10,
    review: "Preety solid"
});


Fruit.updateOne({ _id: "5fbe4fd0ef223509b918bd26" }, { name: "Pear" }, function(err) {


    if (err) {
        console.log("error");

    } else {
        console.log("success");
    }
})
Fruit.deleteOne({ _id: "5fbe4fd0ef223509b918bd26" }, function(dele) {

    if (dele) {
        console.log("error");
    } else {
        console.log("Deleted successfully");
    }
});





fruit.save();

const Orange = new Fruit({
    name: "Orange",
    score: 10,
    review: "world texture"
});
const Kiwi = new Fruit({
    name: "kiwi",
    score: 8,
    review: "texture"
});
const Banna = new Fruit({
    name: "banna",
    score: 10,
    review: "world "
});

Fruit.find(function(err, fruit) {
    if (err) {
        console.log(err);
    } else {
        fruit.forEach(function(items) {
            console.log(items.name);


        });
    }

});



//Fruit.insertMany([fruit, Orange, Kiwi, Banna])
const PeopleSchema = new mongoose.Schema({

    name: String,
    age: Number,
    favfruit: FruitSchema,
    fruit_collection: FruitSchema

});

const People = mongoose.model("People", PeopleSchema);

const pineapp = new Fruit({
    name: "pineapple",
    score: 8
});

const fru = new Fruit({

    name: "dragon",
    score: 7

});
fru.save();


const people = new People({
    name: "hari",
    age: 20,
    favfruit: pineapp

});

people.deleteOne({ name: "JOHN" }, function(err) {
    if (err) {
        console.log("err");
    } else {
        console.log("success");
    }
});
people.updateOne({ name: "JOHN" }, { fruit_collection: fru }, function(err) {
    if (err) {
        console.log("err");
    } else {
        console.log("success");
    }
})

people.save();