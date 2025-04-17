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
        try {
        await client.connect();
        isConnected = true;
        console.log('Connected to MongoDB.')
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
        throw err;
    }
}
    return client;
}

function closeDBConnection() {
    return client.close().then(() => {
        isConnected = false;
    })
}

module.exports = { connectToDB, client, closeDBConnection };