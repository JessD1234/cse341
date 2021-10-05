const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://JESSICA:ObGPEzU0SpCl1fDD@cluster0.4qool.mongodb.net/shop?retryWrites=true&w=majority').then(
    client => {
        console.log('Connected!');
        _db = client.db();
        callback();
    }
).catch(
    err => {
        console.log(err);
        throw error;
    }
);
};

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
