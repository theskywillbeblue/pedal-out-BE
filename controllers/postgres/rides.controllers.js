const {
  fetchRides,
  fetchRideById,
  createNewRide,
  removeRideById,
  updateRideById,
  fetchCommentsByRideId,
  createCommentByRideId,
} = require("../../models/postgres/rides.models.js");

exports.getRides = async (req, res, next) => {
  const { sort_by, order, discipline, lat, long, radius } = req.query;
  try {
    const rows = await fetchRides(
      sort_by,
      order,
      discipline,
      lat,
      long,
      radius
    );
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
  const {
    is_public,
    participants,
    ride_date,
    ride_time,
    description,
    discipline,
    title,
  } = req.body;
  try {
    const ride = await updateRideById(
      ride_id,
      is_public,
      participants,
      ride_date,
      ride_time,
      description,
      discipline,
      title
    );
    res.status(200).send({ ride });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByRideId = async (req, res, next) => {
  const { ride_id } = req.params;
  try {
    const comments = await fetchCommentsByRideId(ride_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postCommentByRideId = async (req, res, next) => {
  const { ride_id } = req.params;
  const { author, created_at, body } = req.body;
  try {
    const newComment = await createCommentByRideId(
      ride_id,
      author,
      created_at,
      body
    );
    res.status(201).send({ newComment });
  } catch (err) {
    next(err);
  }
};
