const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config();

const uri = process.env.MONGODB_URI;
if(!uri) {
    throw new Error("MONGODB_URI not configured.")
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let isConnected = false;


async function connectToDB() {
    if(!isConnected) {
        await client.connect();
        isConnected = true;
        console.log('Connected to MongoDB.')
    }
    return client;
}

function closeDBConnection() {
    return client.close().then(() => {
        isConnected = false;
    })
}

module.exports = { connectToDB, client, closeDBConnection };