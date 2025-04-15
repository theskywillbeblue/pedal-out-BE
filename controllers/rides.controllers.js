const {
  fetchRides,
  fetchRideById,
  createNewRide,
  removeRideById,
  updateRideById,
} = require("../models/rides.models.js");

exports.getRides = async (req, res, next) => {
  try {
    const rows = await fetchRides();
    res.status(200).send({ rides: rows });
  } catch (err) {
    next(err);
  }
};

exports.getRideById = async (req, res, next) => {
  const { ride_id } = req.params;
  try {
    const ride = await fetchRideById(ride_id);
    res.status(200).send({ ride });
  } catch (err) {
    next(err);
  }
};

exports.postNewRide = async (req, res, next) => {
  const {
    author,
    ride_location,
    ride_date,
    ride_time,
    description,
    discipline,
    title,
    is_public,
    participants,
  } = req.body;
  try {
    const newRide = await createNewRide(
      author,
      ride_location,
      ride_date,
      ride_time,
      description,
      discipline,
      title,
      is_public,
      participants
    );
    res.status(201).send({ newRide });
  } catch (err) {
    next(err);
  }
};

exports.deleteRideById = async (req, res, next) => {
  const { ride_id } = req.params;
  try {
    await removeRideById(ride_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.patchRideById = async (req, res, next) => {
  const { ride_id } = req.params;
  const { is_public, participants } = req.body;
  try {
    const ride = await updateRideById(ride_id, is_public, participants);
    res.status(200).send({ ride });
  } catch (err) {
    next(err);
  }
};
