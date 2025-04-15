const { fetchRides, fetchRideById } = require('../models/rides.models.js');

exports.getRides = async (req, res, next) => {
	try {
		const rows = await fetchRides();
		res.status(200).send({ rides: rows });
	} catch (err) {
		next(err);
	}
};

exports.getRideById = async (req, res, next) => {
    const { ride_id } = req.params
	try {
		const ride = await fetchRideById(ride_id);
		res.status(200).send({ ride });
	} catch (err) {
		next(err);
	}
};
