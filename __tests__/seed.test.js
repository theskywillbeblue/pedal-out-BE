const db = require('../db/connection');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/index');

beforeAll(() => seed(data));
afterAll(() => db.end());

describe('seed', () => {
	describe('users table', () => {
		test('users table should exist', () => {
			return db
				.query(
					`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')`
				)
				.then(({ rows: [{ exists }] }) => {
					expect(exists).toBe(true);
				});
		});
		test('users table has the correct columns of the correct type', () => {
			return db.query(`SELECT * FROM users;`).then(({ rows: [column] }) => {
				expect(column).toHaveProperty('full_name')
                expect(column).toHaveProperty('username')
                expect(column).toHaveProperty('avatar_img')
                expect(column).toHaveProperty('is_public')
                expect(column).toHaveProperty('created_at')
                expect(column).toHaveProperty('location')
		
			});
		});
	});
    describe('rides table', () => {
		test('rides table should exist', () => {
			return db
				.query(
					`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'rides')`
				)
				.then(({ rows: [{ exists }] }) => {
					expect(exists).toBe(true);
				});
		});
		test('rides table has the correct columns of the correct type', () => {
			return db.query(`SELECT * FROM rides;`).then(({ rows: [column] }) => {
				expect(column).toHaveProperty('author')
                expect(column).toHaveProperty('ride_id')
                expect(column).toHaveProperty('ride_location')
                expect(column).toHaveProperty('created_at')
                expect(column).toHaveProperty('ride_date')
                expect(column).toHaveProperty('ride_time')
                expect(column).toHaveProperty('description')
                expect(column).toHaveProperty('discipline')
                expect(column).toHaveProperty('is_public')
                expect(column).toHaveProperty('participants')
			});
		});
	});
    describe('comments table', () => {
		test('comments table should exist', () => {
			return db
				.query(
					`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'comments')`
				)
				.then(({ rows: [{ exists }] }) => {
					expect(exists).toBe(true);
				});
		});
		test('comments table has the correct columns of the correct type', () => {
			return db.query(`SELECT * FROM comments;`).then(({ rows: [column] }) => {
				expect(column).toHaveProperty('comment_id')
                expect(column).toHaveProperty('ride_id')
                expect(column).toHaveProperty('body')
                expect(column).toHaveProperty('author')
                expect(column).toHaveProperty('created_at')
			});
		});
	});
});
