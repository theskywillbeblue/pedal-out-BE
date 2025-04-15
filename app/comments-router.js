const commentsRouter = require("express").Router();

commentsRouter
.route("/:comment_id")
.delete()
.patch()

module.exports = commentsRouter;