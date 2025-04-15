const ridesRouter = require("express").Router();
const { getRides } = require("../controllers/rides.controllers");


ridesRouter
.route("/")
.get(getRides)
// .post(postRide)


module.exports = ridesRouter;