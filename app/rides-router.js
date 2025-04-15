const ridesRouter = require("express").Router();
const { getRides } = require("../controllers/rides-controller.js");


ridesRouter
.route("/")
.get(getRides)
// .post(postRide)


module.exports = ridesRouter;