// const { MongoClient, ServerApiVersion } = require("mongodb");
// require('dotenv').config();

// const uri = process.env.MONGODB_URI;
// if(!uri) {
//     throw new Error("MONGODB_URI not configured.")
// }

// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     },
// });

// let isConnected = false;


// async function connectToDB() {
//     if(!isConnected) {
//         try {
//         await client.connect();
//         isConnected = true;
//         console.log('Connected to MongoDB.')
//     } catch (err) {
//         console.error('Error connecting to MongoDB', err);
//         throw err;
//     }
// }
//     return client;
// }

// function closeDBConnection() {
//     return client.close().then(() => {
//         isConnected = false;
//     })
// }

// module.exports = { connectToDB, client, closeDBConnection };

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

let testClient = null;
let isTestConnected = false;

async function connectToDB() {
    if(process.env.NODE_ENV === 'test') {
        if(isTestConnected && testClient) {
            return testClient;
        }

        if(testClient && (!testClient.topology || !testClient.topology.isConnected())) {
            testClient = null;
        }

        if(!testClient) {
            testClient = new MongoClient(uri, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                }, 
                socketTimeoutMS: 60000,
                connectTimeoutMS: 30000,
                serverSelectionTimeoutMS: 30000,
        })
        await testClient.connect();
        isTestConnected = true;
        console.log('Test Mongo DB connection established.');
    }
        return testClient;
    }

    if(!isConnected) {
        await client.connect();
        isConnected = true;
        console.log('Connected to MongoDB.')
    }
    return client;
}

async function closeDBConnection() {
    try {
        if(process.env.NODE_ENV === 'test') {
            if(testClient && isTestConnected) {
                await testClient.close();
                testClient = null;
                isTestConnected = false;
                console.log('Test MongoDB connection closed.')
                }
                return;
            }

            if(client && isConnected) {
                await client.close();
                isConnected = false;
                console.log('Production MongoDB connection closed.')
            }
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        throw err;
    }
}

async function getDatabase(dbName) {
    const connectedClient = await connectToDB();
    if(!connectedClient) {
        throw new Error('Failed to connect to MongoDB');
    }
    return connectedClient.db(dbName);
}

module.exports = { connectToDB, client, closeDBConnection, getDatabase };