const db = require("../connection.js");
const format = require("pg-format");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const seed = ({ usersData, ridesData, commentsData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS rides`);
    })
    .then(() => {
      return db.query(`DROP TYPE IF EXISTS discipline_type`);
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
      return createDistanceCalculator();
    })
    .then(() => {
      return insertRides(ridesData);
    })
    .then(() => {
      return insertComments(commentsData);
    });
};

function createDisciplineType() {
  return db.query(`CREATE TYPE discipline_type AS ENUM (
        'Downhill', 
        'Gravel', 
        'Mountain', 
        'Enduro', 
        'Cross Country', 
        'Park', 
        'Casual'
    )`);
}

function createRides() {
  return db.query(`CREATE TABLE rides(
        author VARCHAR(20) NOT NULL,
        ride_id SERIAL PRIMARY KEY,
        ride_location JSONB NOT NULL,
        created_at TIMESTAMP,
        ride_date DATE NOT NULL, 
        ride_time TIME NOT NULL,
        description VARCHAR(1000),
        discipline discipline_type NOT NULL,
        title VARCHAR(100) NOT NULL,
        is_public BOOLEAN DEFAULT true,
        ride_img_url TEXT,
        participants VARCHAR(20)[] NOT NULL,
        CHECK (array_length(participants, 1) IS NOT NULL)
        )`);
}

function createComments() {
  return db.query(`CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY,
        ride_id INT REFERENCES rides(ride_id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        author VARCHAR(20) NOT NULL,
        created_at TIMESTAMP
        )`);
}

function createDistanceCalculator() {
  return db.query(`CREATE OR REPLACE FUNCTION calculateDistance(search_lat FLOAT, search_long FLOAT, target_lat FLOAT, target_long FLOAT)
    RETURNS FLOAT
    AS
    $$
    BEGIN
      RETURN acos(sin(search_lat)*sin(target_lat)+cos(search_lat)*cos(target_lat)*cos(target_long-search_long))*6371;
    END;
    $$ LANGUAGE plpgsql;`);
}

function insertRides(data) {
  const formattedRides = data.map((ride) => {
    return [
      ride.author,
      JSON.stringify(ride.ride_location),
      ride.created_at,
      ride.ride_date,
      ride.ride_time,
      ride.description,
      ride.discipline,
      ride.title,
      ride.is_public,
      ride.participants,
      ride.ride_img_url,
    ];
  });
  const sqlRides = format(
    `INSERT INTO rides
        (author, ride_location, created_at, ride_date, ride_time, description, discipline, title, is_public, participants, ride_img_url)
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
