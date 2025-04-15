const fetchRides = require("../models/rides.models");


exports.getRides = (req, res, next) => {
	fetchRides()
		.then((rows) => {
			res.status(200).send({ rides: rows });
		})
		.catch((err) => {
			next(err);
		});
};