const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/postgres/users.controllers");


usersRouter
.route("/")
// .get(getUsers)
// .post(postUser)


module.exports = usersRouter;