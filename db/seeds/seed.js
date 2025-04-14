const db = require("../connection.js");
const format = require("pg-format");

const seed = ({ userData, ridesData, commentsData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS rides`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`DROP TYPE IF EXISTS discipline_type`);
    })
    .then(() => {
      return createUsers();
    })
    .then(() => {
      return createDisciplineType();
    })
    .then(() => {
      return createRides();
    })
    .then(() => {
      return createComments();
    })
    .then(() => {
      return insertUsers(userData);
    })
    .then(() => {
      return insertRides(ridesData);
    })
    .then(() => {
      return insertComments(commentsData);
    });
};

function createUsers() {
  return db.query(`CREATE TABLE users(
        full_name VARCHAR(100) NOT NULL,
        username VARCHAR(20) PRIMARY KEY,
        avatar_img VARCHAR(1000),
        public BOOLEAN DEFAULT true,
        created_at TIMESTAMP,
        location VARCHAR(100) NOT NULL
        )`);
}

function createDisciplineType() {
  return db.query(`CREATE TYPE discipline_type AS ENUM
         ('Downhill', 
         'Gravel', 
         'Mountain', 
         'Enduro', 
         'Cross Country', 
         'Park', 
         'Casual')
        `);
}

function createRides() {
  return db.query(`CREATE TABLE rides(
        author VARCHAR(20) REFERENCES users(username) ON DELETE CASCADE,
        ride_id SERIAL PRIMARY KEY,
        ride_location JSONB NOT NULL,
        created_at TIMESTAMP,
        ride_date DATE NOT NULL, 
        ride_time TIME NOT NULL,
        description VARCHAR(1000),
        discipline discipline_type NOT NULL,
        title VARCHAR(100) NOT NULL,
        public BOOLEAN DEFAULT true,
        participants INTEGER[] 
        )`);
}

function createComments() {
  return db.query(`CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY,
        ride_id INT REFERENCES rides(ride_id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        author VARCHAR(20) REFERENCES users(username) ON DELETE CASCADE,
        created_at TIMESTAMP
        )`);
}

function insertUsers(data) {
  const formattedUsers = data.map((user) => {
    return [
      user.username,
      user.full_name,
      user.avatar_img,
      user.public,
      user.created_at,
      user.location,
    ];
  });
  const sqlUsers = format(
    `INSERT INTO users 
        (username, full_name, avatar_img, public, created_at, location)
        VALUES %L RETURNING *`,
    formattedUsers
  );
  return db.query(sqlUsers);
}

function insertRides(data) {
  const formattedRides = data.map((ride) => {
    return [
      ride.author,
      ride.ride_location,
      ride.created_at,
      ride.ride_date,
      ride.ride_time,
      ride.description,
      ride.discipline,
      ride.title,
      ride.public,
      ride.participants,
    ];
  });
  const sqlRides = format(
    `INSERT INTO rides
        (author, ride_location, created_at, ride_date, ride_time, description, discipline, title, public, participants)
        VALUES %L RETURNING *`,
    formattedRides
  );
  return db.query(sqlRides);
}

function insertComments(data) {
  const formattedComments = data.map((comment) => {
    return [comment.ride_id, comment.body, comment.created_at, comment.author];
  });
  const sqlComments = format(
    `INSERT INTO comments
        (ride_id, body, created_at, author)
        VALUES %L RETURNING *`,
    formattedComments
  );
  return db.query(sqlComments);
}

module.exports = seed;
