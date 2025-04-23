const request = require("supertest");
const app = require('../app/app.js');
const {seedTestChatData} = require('../db/seeds/seed-mongodb.js');
const {connectToDB, closeDBConnection} = require('../db/mongodb-connection.js');
jest.setTimeout(15000);

beforeAll(async () => {
    try {
        await connectToDB();
    } catch (err) {
        console.error('Failed to connect to test database:', err);
        throw err;
    }
});

beforeEach(async () => {
    try {
        await seedTestChatData();
    } catch (err) {
        console.error('Failed to seed test data"', err);
        throw err;
    }
})

afterAll(async () => {
    try {
        await closeDBConnection();
    } catch (err) {
        console.error('Error closing database connection:', err)
    }
})

describe("POST /api/chats/chat_001", () => {
    test("201: returns a document containing message details if the message has successfully posted when a chatId already exists", () => {
        return request(app)
        .post('/api/chats/chat_001')
        .send({
            chatPartner: "testUser2",
            username: "testUser1",
            message: "Hi, this is a test message."
        })
        .expect(201)
        .then(({ body }) => {
            expect(typeof body).toEqual('object');
            expect(body.acknowledged).toBe(true);
            expect(body.insertedId).toBeDefined();
        })
    })
})
describe("POST /api/chats", () => {
    test("201: returns a document containing message details if the message has successfully posted when a chatId didn't already exists", () => {
        return request(app)
        .post('/api/chats')
        .send({
            chatPartner: "testUser7",
            username: "testUser1",
            message: "Hi, this is a test message for a new chat."
        })
        .expect(201)
        .then(({ body }) => {
            expect(typeof body).toEqual('object');
            expect(body.acknowledged).toBe(true);
            expect(body.insertedId).toBeDefined();
        })
    })
})

describe("GET /api/chats/:chatId", () => {
    test("200: returns an array of messages for the corresponding chatId", () => {
        return request(app)
        .get('/api/chats/chat_001')
        .expect(200)
        .then(({body}) => {
            expect(body.length).toBe(4);
            body.forEach((message) => {
                expect(message.chatId).toBe('chat_001');
            })
        })
    })
})

describe("GET /api/chats", () => {
    test("200: returns an array of chatIds and chatPartners for the corresponding username", () => {
        return request(app)
        .get('/api/chats?username=testUser1')
        .expect(200)
        .then(({body}) => {
            const {chatInfo} = body
            expect(chatInfo[0]).toEqual([ 'chat_003', 'testUser3' ]);
            expect(chatInfo[1]).toEqual([ 'chat_001', 'testUser2' ])
        })
    })
})