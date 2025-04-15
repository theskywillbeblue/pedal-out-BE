const format = require("pg-format");
const db = require("../db/connection.js");

exports.fetchRides = async () => {
  const { rows } = await db.query(`SELECT * FROM rides;`);
  return rows;
};

exports.fetchRideById = async (ride_id) => {
  const { rows } = await db.query(`SELECT * FROM rides WHERE ride_id = $1`, [
    ride_id,
  ]);
  if (rows[0] === undefined) {
    return Promise.reject({ status: 404, msg: "ride not found" });
  }
  return rows[0];
};

exports.createNewRide = async (
  author,
  ride_location,
  ride_date,
  ride_time,
  description,
  discipline,
  title,
  is_public,
  participants
) => {
  const { rows } = await db.query(
    `INSERT INTO rides (
  author,
  ride_location,
  ride_date,
  ride_time,
  description,
  discipline,
  title,
  is_public,
  participants,
  created_at
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP) RETURNING *`,
    [
      author,
      ride_location,
      ride_date,
      ride_time,
      description,
      discipline,
      title,
      is_public,
      participants,
    ]
  );
  return rows[0];
};

exports.removeRideById = async (ride_id) => {
  const { rows } = await db.query(
    `DELETE FROM rides WHERE ride_id = $1 RETURNING *`,
    [ride_id]
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "ride not found" });
  }
};

exports.updateRideById = async (ride_id, is_public, participants) => {
  let queryString;
  let columnToUpdate;
  if (is_public === undefined && participants === undefined) {
    return Promise.reject({ status: 400, msg: "Invalid input." });
  }
  if (is_public !== undefined) {
    queryString = `UPDATE rides SET is_public = $1 WHERE ride_id = $2 RETURNING *`;
    columnToUpdate = is_public;
  } else if (participants) {
    queryString = `UPDATE rides SET participants = participants || ARRAY[$1] WHERE ride_id = $2 RETURNING *`;
    columnToUpdate = participants;
  }
  const { rows } = await db.query(queryString, [columnToUpdate, ride_id]);
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "ride not found" });
  }
  return rows[0];
};
