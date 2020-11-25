const MongoClient = require("mongodb").MongoClient;
const assert = require('assert');
const uri = 'mongodb://localhost:27017';


const database = 'fruitsDB';
const client = new MongoClient(uri, { useUnifiedTopology: true });


client.connect(function(err) {

    assert.equal(null, err);
    console.log("connected successfully");
    const db = client.db(database);

    insertDocuments(db, function() {
        client.close();

    });



});


const insertDocuments = function(db, callback) {

    const collection = db.collection('fruits');

    collection.insertMany([{
                name: "Apple",
                score: 8,
                review: "great"
            },
            {
                name: "Orange",
                score: 10,
                review: "superb"
            },
            {
                name: "Banana",
                score: 9,
                review: "Great-Stuff"
            },



        ],

        function(err, result) {
            assert.equal(err, null);
            assert.equal(3, result.result.n);
            assert.equal(3, result.ops.length);
            console.log("inserted successfully 3");
            callback(result);
        });
}