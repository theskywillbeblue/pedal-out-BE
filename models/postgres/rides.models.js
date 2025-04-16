const format = require("pg-format");
const db = require("../../db/connection.js");
const {
  checkExists,
  capitaliseFirstLetter,
} = require("../../db/seeds/utils.js");

exports.fetchRides = async (
  sort_by = "ride_date",
  order = "ASC",
  discipline
) => {
  const allowedValues = ["ride_date", "ride_time", "created_at"];
  if (!allowedValues.includes(sort_by) || (order.toUpperCase() !== "ASC" && order.toUpperCase() !== "DESC")) {
    return Promise.reject({ status: 400, msg: "Invalid input." });
  }
  let queryString = `SELECT * FROM rides`;
  let dollarSign = 1;
  const queries = [];
  if (discipline) {
    queryString += ` WHERE discipline = $${dollarSign}`;
    dollarSign++;
    queries.push(capitaliseFirstLetter(discipline));
  }
  queryString += ` ORDER BY ${sort_by} ${
    order.toUpperCase() === "ASC" ? "ASC" : "DESC"
  }`;
  const { rows } = await db.query(queryString, queries);
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

exports.updateRideById = async (
  ride_id,
  is_public,
  participants,
  ride_date,
  ride_time,
  description,
  discipline,
  title
) => {
  let queryString;
  let columnsToUpdate;
  let dollarSign = 1;
  if (
    is_public === undefined &&
    !participants &&
    !ride_date &&
    !ride_time &&
    !description &&
    !discipline &&
    !title
  ) {
    return Promise.reject({ status: 400, msg: "Invalid input." });
  }
  if (participants) {
    queryString = `UPDATE rides SET participants = participants || ARRAY[$1] WHERE ride_id = $2 RETURNING *`;
    columnsToUpdate = [participants];
  } else {
    queryString = `UPDATE rides SET `;
    columnsToUpdate = [];
    if (is_public !== undefined) {
      if (dollarSign !== 1) {
        queryString += `,`;
      }
      queryString += ` is_public = $${dollarSign}`;
      dollarSign++;
      columnsToUpdate.push(is_public);
    }
    if (ride_date) {
      if (dollarSign !== 1) {
        queryString += `,`;
      }
      queryString += ` ride_date = $${dollarSign}`;
      dollarSign++;
      columnsToUpdate.push(ride_date);
    }
    if (ride_time) {
      if (dollarSign !== 1) {
        queryString += `,`;
      }
      queryString += ` ride_time = $${dollarSign}`;
      dollarSign++;
      columnsToUpdate.push(ride_time);
    }
    if (description) {
      if (dollarSign !== 1) {
        queryString += `,`;
      }
      queryString += ` description = $${dollarSign}`;
      dollarSign++;
      columnsToUpdate.push(description);
    }
    if (discipline) {
      if (dollarSign !== 1) {
        queryString += `,`;
      }
      queryString += ` discipline = $${dollarSign}`;
      dollarSign++;
      columnsToUpdate.push(discipline);
    }
    if (title) {
      if (dollarSign !== 1) {
        queryString += `,`;
      }
      queryString += ` title = $${dollarSign}`;
      dollarSign++;
      columnsToUpdate.push(title);
    }
    queryString += ` WHERE ride_id = $${dollarSign} RETURNING *`;
  }
  const { rows } = await db.query(queryString, [...columnsToUpdate, ride_id]);
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "ride not found" });
  }
  return rows[0];
};

exports.fetchCommentsByRideId = (ride_id) => {
  const promises = [];
  promises.push(checkExists("rides", "ride_id", ride_id));
  promises.unshift(
    db.query(`SELECT * FROM comments WHERE ride_id = $1`, [ride_id])
  );
  return Promise.all(promises).then(([{ rows }]) => {
    return rows;
  });
};

exports.createCommentByRideId = async (ride_id, author, created_at, body) => {
  const { rows } = await db.query(
    `INSERT INTO comments (ride_id, author, created_at, body)
    VALUES ($1, $2, $3, $4) RETURNING *`,
    [ride_id, author, created_at, body]
  );
  return rows[0];
};
