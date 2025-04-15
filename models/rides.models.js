const db = require('../db/connection.js');


exports.fetchRides = async () => {
	const { rows } = await db.query(`SELECT * FROM rides`	
	);
	return rows;
};