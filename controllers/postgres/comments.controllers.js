const { removeCommentById, updateCommentById } = require("../../models/postgres/comments.models");

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    removeCommentById(comment_id)
    .then(() => {
        res.status(204).send();
    })
    .catch((err) => {
        next(err);
    })
}

exports.patchCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    const { body } = req.body;
    updateCommentById(body, Number(comment_id))
    .then((comment) => {
        res.status(200).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}