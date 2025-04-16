const ridesRouter = require("express").Router();
const {
  getRides,
  getRideById,
  postNewRide,
  deleteRideById,
  patchRideById,
  getCommentsByRideId,
  postCommentByRideId,
} = require("../controllers/rides.controllers");

ridesRouter.route("/").get(getRides).post(postNewRide);

ridesRouter
  .route("/:ride_id")
  .get(getRideById)
  .delete(deleteRideById)
  .patch(patchRideById);

ridesRouter
  .route("/:ride_id/comments")
  .get(getCommentsByRideId)
  .post(postCommentByRideId);

module.exports = ridesRouter;
