const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const app = require("../app/app.js");
const rides = require("../db/data/test-data/rides.js");

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
    test("200: Get all rides of a specified discipline", () => {
      return request(app)
        .get("/api/rides?discipline=enduro")
        .expect(200)
        .then(({ body }) => {
          expect(body.rides).toBeInstanceOf(Array);
          expect(body.rides.length).toBe(2);
          body.rides.forEach((ride) => {
            expect(ride.discipline).toBe("Enduro");
          });
        });
    });
    test("400: Responds with an error if an invalid discipline is provided", () => {
      return request(app)
        .get("/api/rides?discipline=not_a_discipline")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
    test("200: Rides are ordered by date in ascending order by default", () => {
      return request(app)
        .get("/api/rides")
        .expect(200)
        .then(({ body }) => {
          expect(body.rides).toBeSortedBy("ride_date", { descending: false });
        });
    });
    test("200: Rides are ordered by the specified column in the specified order", () => {
      return request(app)
        .get("/api/rides?sort_by=created_at&order=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.rides).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("400: Returns an error if sort_by is given an invalid value", () => {
      return request(app)
        .get("/api/rides?sort_by=not_a_column&order=desc")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
    test("400: Returns an error if order is given an invalid value", () => {
      return request(app)
        .get("/api/rides?sort_by=created_at&order=invalid")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
    test("200: Get all rides 10 miles of a specified location by default", () => {
      return request(app)
        .get("/api/rides?lat=51.82&long=-3.406")
        .expect(200)
        .then(({ body }) => {
          expect(body.rides).toBeInstanceOf(Array);
          expect(body.rides.length).toBe(1);
          expect(body.rides[0].ride_id).toBe(1);
        });
    });
    test("200: Get all rides within a specified radius of a specified location", () => {
      return request(app)
        .get("/api/rides?lat=51.82&long=-3.406&radius=20")
        .expect(200)
        .then(({ body }) => {
          expect(body.rides).toBeInstanceOf(Array);
          expect(body.rides.length).toBe(2);
        });
    });
    test("400: Returns an error if latitude is missing", () => {
      return request(app)
        .get("/api/rides?long=-3.406&radius=20")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
    test("400: Returns an error if latitude is given an invalid value", () => {
      return request(app)
        .get("/api/rides?lat=fifty&long=-3.406&radius=20")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
    test("400: Returns an error if radius is given an invalid value", () => {
      return request(app)
        .get("/api/rides?lat=51.82&long=-3.406&radius=twenty")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
    test("200: Get all rides within a specified radius of a specified location sorted by distance", () => {
      return request(app)
        .get("/api/rides?lat=51.82&long=-3.406&radius=20&sort_by=distance")
        .expect(200)
        .then(({ body }) => {
          expect(body.rides).toBeInstanceOf(Array);
          expect(body.rides.length).toBe(2);
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
          descrptn: "Test.",
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
  describe("GET /api/rides/:ride_id/comments", () => {
    test("200: responds with an array of all comments for the ride with a given id", () => {
      return request(app)
        .get("/api/rides/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toBeInstanceOf(Array);
          expect(body.comments.length).toBe(3);
        });
    });
    test("200: responds with an empty array if the ride has no comments", () => {
      return request(app)
        .get("/api/rides/4/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toBeInstanceOf(Array);
          expect(body.comments.length).toBe(0);
        });
    });
    test("404: responds with an error if there is no ride with a matching id", () => {
      return request(app)
        .get("/api/rides/999999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Resource not found");
        });
    });
    test("400: responds with an error if the ride id is invalid", () => {
      return request(app)
        .get("/api/rides/not_an_id/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
  });
  describe("POST /api/:ride_id/comments", () => {
    test("201: Responds with newly created comment", () => {
      return request(app)
        .post("/api/rides/1/comments")
        .send({
          author: "will_clarke_2025",
          created_at: "2025-03-05T19:14:08",
          body: "Test.",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.newComment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              ride_id: 1,
              author: "will_clarke_2025",
              created_at: "2025-03-05T19:14:08.000Z",
              body: "Test.",
            })
          );
        });
    });
    test("400: Responds with an error if there is no ride with the matching id", () => {
      return request(app)
        .post("/api/rides/99999/comments")
        .send({
          author: "will_clarke_2025",
          created_at: "2025-03-05T19:14:08",
          body: "Test.",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
    test("400: Responds with an error if the request body contains invalid keys", () => {
      return request(app)
        .post("/api/rides/1/comments")
        .send({
          Arthur: "will_clarke_2025",
          createdAt: "2025-03-05T19:14:08",
          o: "Test.",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
    test("400: Responds with an error if the request body contains a nonexistent author", () => {
      return request(app)
        .post("/api/rides/1/comments")
        .send({
          author: "not_a_user",
          created_at: "2025-03-05T19:14:08",
          body: "Test.",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input.");
        });
    });
  });
});
