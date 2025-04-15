const ridesRouter = require("express").Router();
const { getRides, getRideById, postNewRide, deleteRideById } = require("../controllers/rides.controllers");


ridesRouter
.route("/")
.get(getRides)
.post(postNewRide)

ridesRouter
.route("/:ride_id")
.get(getRideById)
.delete(deleteRideById)


module.exports = ridesRouter;