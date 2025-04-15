const commentsRouter = require("express").Router();

const { getComments, deleteCommentById, patchCommentById } = require("../controllers/comments.controllers");


// commentsRouter
// .route("/")
// .get(getComments)
// .post(postComment)


commentsRouter
.route("/:comment_id")
.delete(deleteCommentById)
.patch(patchCommentById)

module.exports = commentsRouter;