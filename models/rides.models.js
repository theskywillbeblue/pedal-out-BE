const db = require('../db/connection.js');

exports.fetchRides = async () => {
	const { rows } = await db.query(`SELECT * FROM rides;`);
	return rows;
};

exports.fetchRideById = async (ride_id) => {
	const { rows } = await db.query(`SELECT * FROM rides WHERE ride_id = $1`, [ride_id]);
	if (rows[0] === undefined)
		{return Promise.reject({ status: 404, msg: 'ride not found' })}
	return rows[0];
};