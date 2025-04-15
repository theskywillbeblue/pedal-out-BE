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
					expect(body.rides.length).toBe(5)
				});
		});
       
	});
    describe('GET /api/rides/:ride_id', () => {
		test('200: Get a specific ride by id', () => {
			return request(app)
				.get('/api/rides/1')
				.expect(200)
				.then(({ body }) => {
                    expect(body.ride).toEqual(
                        expect.objectContaining({
                            ride_id: 1,
                            author: "will_clarke_2025",
                            ride_location: { lat: 51.8197, lng: -3.4063 },
                            created_at: "2025-03-03T13:22:49.000Z",
                            ride_date: "2025-04-19T23:00:00.000Z",
                            ride_time: "10:30:00",
                            description: "Gonna hit some jumps and tech lines at BPW. Bring pads and let’s send it!",
                            discipline: "Downhill",
                            title: "Shred Day at BPW – Jumps, Berms & Gnar!",
                            is_public: true,
                            participants: {}
                        })
                    );
                });
		});
        test('404: Responds with an error message if the ride does not exist', () => {
            return request(app)
                .get('/api/rides/999999')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('ride not found');
                });
        });
        test('400: Responds with an error if the ride_id is given in an incorrect format', () => {
            return request(app)
                .get('/api/rides/not-a-number')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Invalid input.');
                });
        });
       
	});
    
});
