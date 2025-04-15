const apiRouter = require("express").Router();
const { getEndpoints } = require("../controllers/api.controllers.js");



apiRouter.get("/", getEndpoints);



module.exports = apiRouter