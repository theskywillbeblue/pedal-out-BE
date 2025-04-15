const request = require("supertest");
const app = require('../app/app.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/index.js');
const db = require('../db/connection.js');

beforeEach(() => {
    return seed(data);
})

afterAll(() => {
    return db.end();
})

describe("DELETE /api/comments/:comment_id", () => {
    test("204: responds with no content after successfully deleting a comment which has been selected by comment_id", () => {
        return request(app)
        .delete('/api/comments/2')
        .expect(204)
        .then(({body}) => {
            expect(Object.keys(body).length).toBe(0);
        })
    })
    test("404: responds with an error message if comment_id does not exist", () => {
        return request(app)
        .delete('/api/comments/2020')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Comment not found.');
        })
    })
    test("400: responds with an error message if comment_id is invalid", () => {
        return request(app)
        .delete('/api/comments/two')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid input.');
        })
    })
})

describe("PATCH: /api/comments/:comment_id", () => {
    test("200: responds with a comment object with updated body as per user's request", () => {
        return request(app)
        .patch("/api/comments/2")
        .send({
            body: "Great route – smooth climbs and fast descents!"
        })
        .expect(200)
        .then(({body}) => {
            const comment = body.comment;
            expect(comment.comment_id).toBe(2);
            expect(comment.ride_id).toBe(1);
            expect(comment.created_at).toBe("2025-02-02T14:27:35");
            expect(comment.author).toBe("jwilson_rider42795");
            expect(comment.body).toBe("Great route – smooth climbs and fast descents!");
        })
    })
    test("400: responds with an error message when the body is invalid", () => {
        return request(app)
        .patch("/api/comments/2")
        .send({
            body: null
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid input.')
        })
    })
    test("404: responds with an error message when the comment doesn't exist", () => {
        return request(app)
        .patch("/api/comments/two")
        .send({
            body: "Great route – smooth climbs and fast descents!"
        })
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Comment not found.')
        })
    })
})