const request = require('supertest');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/index.js');
const db = require('../db/connection.js');
const app = require('../app/app.js');

beforeEach(() => {
	return seed(data);
});

afterAll(() => {
	return db.end();
});

describe('RIDES', () => {
	describe('GET /api/rides', () => {
		test('200: Get all rides', () => {
			return request(app)
				.get('/api/rides')
				.expect(200)
				.then(({ body }) => {
					expect(body.rides).toBeInstanceOf(Array);
					expect(body.rides.length).toBe; //length;
				});
		});
	});
});
