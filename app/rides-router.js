const ridesRouter = require("express").Router();
const { getRides, getRideById, postNewRide, deleteRideById, patchRideById } = require("../controllers/rides.controllers");


ridesRouter
.route("/")
.get(getRides)
.post(postNewRide)

ridesRouter
.route("/:ride_id")
.get(getRideById)
.delete(deleteRideById)
.patch(patchRideById)


module.exports = ridesRouter;