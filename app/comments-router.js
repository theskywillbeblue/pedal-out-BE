const commentsRouter = require("express").Router();
const { getComments } = require("../controllers/comments.controllers");


commentsRouter
.route("/")
// .get(getComments)
// .post(postComment)


module.exports = commentsRouter;