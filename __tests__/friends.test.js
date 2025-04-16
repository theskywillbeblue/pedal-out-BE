const request = require("supertest");
const app = require('../app/app.js');
const {seedTestData} = require('../db/seeds/seed-mongodb.js');
const {connectToDB, closeDBConnection} = require('../db/mongodb-connection.js');

beforeEach(() => {
    return seedTestData();
})

afterAll(() => {
    closeDBConnection();
})

describe("POST /api/friends/:username", () => {
    test("201: successfully creates a new friendship object", () => {
        return request(app)
        .post('/api/friends/livmotley10')
        .expect(201)
        .send(
            {
                followingUsername: "newUser10"
            })
        .then(({ body }) => {
            expect(body.friendshipId).toBeDefined();
        })
    })
    test("403: returns an error if the friendship already exists", () => {
        return request(app)
        .post('/api/friends/testUser1')
        .expect(403)
        .send(
            {
                followingUsername: "testUser6"
            })
        .then(({ body }) => {
            expect(body.success).toBeUndefined();
        })
    })
})

describe("GET /api/friends/:username", () => {
    test("200: returns an array of all follower usernames and following usernames", () => {
        return request(app)
        .get('/api/friends/testUser3')
        .expect(200)
        .then(({body}) => {
            const { followedUsers, usersFollowers } = body;
            expect(followedUsers.length).toBe(2);
            expect(usersFollowers.length).toBe(2);
        })
    }),
    test("200: returns an array of all follower usernames even if they don't follow anyone", () => {
        return request(app)
        .get('/api/friends/testUser6')
        .expect(200)
        .then(({body}) => {
            const { followedUsers, usersFollowers } = body;
            expect(followedUsers.length).toBe(0);
            expect(usersFollowers.length).toBe(1);
        })
    }),
    test("404: returns a 404 error when there are no followers and no following accounts found", () => {
        return request(app)
        .get('/api/friends/testUser7')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("User has 0 followers and doesn't follow any accounts.");
        })
    })
})

describe("DELETE /api/friends/:username", () => {
    test("204: responds with a 204 and no content when relationship has been successfully deleted", () => {
        return request(app)
        .delete('/api/friends/testUser1')
        .send({
            followingUsername: "testUser6"
        })
        .expect(204)
        .then(({body}) => {
            expect(body).toEqual({});
        })
    })
    test("404: responds with a 404 when a relationship doesn't exist to delete", () => {
        return request(app)
        .delete('/api/friends/testUser1')
        .send({
            followingUsername: "testUser7"
        })
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Friendship not found.');
        })
    })
})

describe("DELETE /api/friends", () => {
    test("204: responds with a 204 and no content when all relationships have been successfully deleted", () => {
        return request(app)
        .delete('/api/friends')
        .send({
            username: "testUser1"
        })
        .expect(204)
        .then(({body}) => {
            expect(body).toEqual({});
        })
    })
    test("404: responds with a 404 when a relationship doesn't exist to delete", () => {
        return request(app)
        .delete('/api/friends')
        .send({
            username: "testUser7"
        })
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('No followers or following to delete.');
        })
    })
})