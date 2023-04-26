require('dotenv').config();
const { MongoClient } = require('mongodb')

const URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@neoncluster.c2uqg33.mongodb.net/?retryWrites=true&w=majority`

let dbConnection;

module.exports = {
    connectToDb: (callback) => {
        MongoClient.connect(URL)
        .then((client) => {
            dbConnection = client.db();
            return callback();
        })
        .catch(err => {
            console.log(err);
            return callback(err);
        })
    },
    getDb: () => dbConnection // return database connection
}