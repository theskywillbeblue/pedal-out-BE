const commentsRouter = require("express").Router();

const { getComments } = require("../controllers/comments.controllers");


commentsRouter
.route("/")
// .get(getComments)
// .post(postComment)


commentsRouter
.route("/:comment_id")
.delete()
.patch()

module.exports = commentsRouter;