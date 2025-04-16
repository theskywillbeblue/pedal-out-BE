const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const app = require("../app/app.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("RIDES", () => {
  describe("GET /api/rides", () => {
    test("200: Get all rides", () => {
      return request(app)
        .get("/api/rides")
        .expect(200)
        .then(({ body }) => {
          expect(body.rides).toBeInstanceOf(Array);
          expect(body.rides.length).toBe(5);
        });
    });
  });
  describe("GET /api/rides/:ride_id", () => {
    test("200: Get a specific ride by id", () => {
      return request(app)
        .get("/api/rides/1")
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
              description:
                "Gonna hit some jumps and tech lines at BPW. Bring pads and let’s send it!",
              discipline: "Downhill",
              title: "Shred Day at BPW – Jumps, Berms & Gnar!",
              is_public: true,
              participants: ["will_clarke_2025"],
            })
          );
        });
    });
    test("404: Responds with an error message if the ride does not exist", () => {
      return request(app)
        .get("/api/rides/999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("ride not found");
        });
    });
    test("400: Responds with an error if the ride_id is given in an incorrect format", () => {
      return request(app)
        .get("/api/rides/not-a-number")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
  });
  describe("POST /api/rides", () => {
    test("201: Responds with newly created ride", () => {
      return request(app)
        .post("/api/rides")
        .send({
          author: "will_clarke_2025",
          ride_location: { lat: 60, lng: -5 },
          ride_date: "2025-05-24",
          ride_time: "06:30",
          description: "A really great ride.",
          discipline: "Downhill",
          title: "A great ride",
          is_public: true,
          participants: '{"will_clarke_2025"}',
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.newRide).toEqual(
            expect.objectContaining({
              ride_id: expect.any(Number),
              author: "will_clarke_2025",
              ride_location: { lat: 60, lng: -5 },
              created_at: expect.any(String),
              ride_date: expect.any(String),
              ride_time: "06:30:00",
              description: "A really great ride.",
              discipline: "Downhill",
              title: "A great ride",
              is_public: true,
              participants: ["will_clarke_2025"],
            })
          );
        });
    });
    test("400: Responds with an error if the inserted object contains invalid keys", () => {
      return request(app)
        .post("/api/rides")
        .send({
          authr: "will_clarke_2025",
          ridelocation: { lat: 60, lng: -5 },
          ride_date: "2025-05-24",
          ride_time: "06:30",
          descrition: "A really great ride.",
          discipline: "Downhill",
          title: "A great ride",
          is_public: true,
          participant: '{"will_clarke_2025"}',
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
    test("400: Responds with an error if the inserted object contains an invalid author", () => {
      return request(app)
        .post("/api/rides")
        .send({
          author: "not_a_user",
          ride_location: { lat: 60, lng: -5 },
          ride_date: "2025-05-24",
          ride_time: "06:30",
          description: "A really great ride.",
          discipline: "Downhill",
          title: "A great ride",
          is_public: true,
          participants: '{"will_clarke_2025"}',
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
    test("400: Responds with an error if the inserted object contains an invalid discipline", () => {
      return request(app)
        .post("/api/rides")
        .send({
          author: "will_clarke_2025",
          ride_location: { lat: 60, lng: -5 },
          ride_date: "2025-05-24",
          ride_time: "06:30",
          description: "A really great ride.",
          discipline: "Rugby",
          title: "A great ride",
          is_public: true,
          participants: '{"will_clarke_2025"}',
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
    test("400: Responds with an error if the inserted object has no participants", () => {
      return request(app)
        .post("/api/rides")
        .send({
          author: "will_clarke_2025",
          ride_location: { lat: 60, lng: -5 },
          ride_date: "2025-05-24",
          ride_time: "06:30",
          description: "A really great ride.",
          discipline: "Downhill",
          title: "A great ride",
          is_public: true,
          participants: "{}",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
  });
  describe("DELETE /api/rides/:ride_id", () => {
    test("204: Responds with no content if deletion was successful", () => {
      return request(app)
        .delete("/api/rides/1")
        .expect(204)
        .then(({ body }) => {
          expect(Object.keys(body).length).toBe(0);
        });
    });
    test("404: Responds with an error if the ride does not exist", () => {
      return request(app)
        .delete("/api/rides/999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("ride not found");
        });
    });
    test("400: Responds with an error if given an invalid ride id", () => {
      return request(app)
        .delete("/api/rides/not_an_id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
  });
  describe("PATCH /api/rides/:ride_id", () => {
    test("200: Responds with the updated ride object if the ride is changed from public to private", () => {
      return request(app)
        .patch("/api/rides/1")
        .send({
          is_public: false,
        })
        .expect(200)
        .then(({ body }) => {
          expect(body.ride).toEqual(
            expect.objectContaining({
              ride_id: 1,
              author: "will_clarke_2025",
              ride_location: { lat: 51.8197, lng: -3.4063 }, // BikePark Wales
              created_at: "2025-03-03T13:22:49.000Z",
              ride_date: "2025-04-19T23:00:00.000Z",
              ride_time: "10:30:00",
              description:
                "Gonna hit some jumps and tech lines at BPW. Bring pads and let’s send it!",
              discipline: "Downhill",
              title: "Shred Day at BPW – Jumps, Berms & Gnar!",
              is_public: false,
              participants: ["will_clarke_2025"],
            })
          );
        });
    });
    test("200: Responds with the updated ride object when a participant is added", () => {
      return request(app)
        .patch("/api/rides/1")
        .send({
          participants: "alex_davies_2025",
        })
        .expect(200)
        .then(({ body }) => {
          expect(body.ride).toEqual(
            expect.objectContaining({
              ride_id: 1,
              author: "will_clarke_2025",
              ride_location: { lat: 51.8197, lng: -3.4063 }, // BikePark Wales
              created_at: "2025-03-03T13:22:49.000Z",
              ride_date: "2025-04-19T23:00:00.000Z",
              ride_time: "10:30:00",
              description:
                "Gonna hit some jumps and tech lines at BPW. Bring pads and let’s send it!",
              discipline: "Downhill",
              title: "Shred Day at BPW – Jumps, Berms & Gnar!",
              is_public: true,
              participants: ["will_clarke_2025", "alex_davies_2025"],
            })
          );
        });
    });
    test("200: Responds with the updated ride object if multiple keys are changed", () => {
      return request(app)
        .patch("/api/rides/1")
        .send({
          is_public: false,
          ride_date: "2025-04-14",
          ride_time: "07:30",
          description:
            "Gonna hit some jumps and tech lines at BPW. Bring pads and let’s send it.",
          discipline: "Cross Country",
          title: "Shred Day at BPW – Jumps, Berms & Gnar",
        })
        .expect(200)
        .then(({ body }) => {
          expect(body.ride).toEqual(
            expect.objectContaining({
              ride_id: 1,
              author: "will_clarke_2025",
              ride_location: { lat: 51.8197, lng: -3.4063 }, // BikePark Wales
              created_at: "2025-03-03T13:22:49.000Z",
              ride_date: "2025-04-13T23:00:00.000Z",
              ride_time: "07:30:00",
              description:
                "Gonna hit some jumps and tech lines at BPW. Bring pads and let’s send it.",
              discipline: "Cross Country",
              title: "Shred Day at BPW – Jumps, Berms & Gnar",
              is_public: false,
              participants: ["will_clarke_2025"],
            })
          );
        });
    });
    test("404: Responds with an error if the ride does not exist", () => {
      return request(app)
        .patch("/api/rides/99999")
        .send({
          is_public: false,
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("ride not found");
        });
    });
    test("400: Responds with an error if the ride id is invalid", () => {
      return request(app)
        .patch("/api/rides/not_an_id")
        .send({
          is_public: false,
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
    test("400: Responds with an error if the request object contains invalid keys", () => {
      return request(app)
        .patch("/api/rides/1")
        .send({
          isPublic: false,
          descrptn: "Test."
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
    test("400: Responds with an error if the request object contains invalid values", () => {
      return request(app)
        .patch("/api/rides/1")
        .send({
          is_public: 6,
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
  });
});
