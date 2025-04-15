const request = require('supertest');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/index.js');
const db = require('../db/connection.js');
const app = require('../app/app.js');

beforeEach(() => {
    return seed(data);
})

afterAll(() => {
    return db.end();
})

describe('GET a 404 for non existent endpoints', () => {
	test('404: Return a 404 error if the endpoint is not found', () => {
		return request(app)
			.get('/api/nonexistent')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Path not found.');
			});
	});
});