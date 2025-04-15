const commentsRouter = require("express").Router();
const { getComments } = require("../controllers/comments-controller.js");


commentsRouter
.route("/")
.get(getComments)
// .post(postComment)


module.exports = commentsRouter;