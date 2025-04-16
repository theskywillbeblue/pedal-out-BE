const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("checkExists", () => {
  test("Returns undefined when passed a value that exists in the given table and column", () => {
    checkExists("rides", "ride_id", 1).then((output) => {
      expect(output).toBe(undefined);
    });
  });
  test('Returns an error with a status key of 404 and a message of "Resource not found" when passed a value that does not exist in the given table and column', () => {
    checkExists("rides", "ride_id", 9999999)
      .then((output) => {
        expect(output.status).toBe(404);
        expect(output.msg).toBe("Resource not found");
      })
  });
});
