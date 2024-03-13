

const { MongoClient } = require('mongodb');
const { default: mongoose } = require("mongoose");

//const connectionString = 'mongodb+srv://Bhavana27:Taekook123@cluster0.sswtp3u.mongodb.net/';
const connectionString = 'mongodb://localhost:27017/test';

const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection;

// async function main() {
//     await mongoose.connect('mongodb://localhost:27017/test');
// }

module.exports = {
    connectToServer: function (callback) {
        mongoose.connect('mongodb://localhost:27017/test', callback);

        // client.connect(function (err, db) {
        //     if (err || !db) {
        //         return callback(err);
        //     }

        //     dbConnection = db.db('test');
        //     console.log('Successfully connected to MongoDB.');

        return callback();
        // });
    },

    getDb: function () {
        return dbConnection;
    },
};