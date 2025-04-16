const db = require('../../db/connection.js');

exports.removeCommentById = (comment_id) => {
    return db.query(`
        DELETE FROM comments
        WHERE comment_id = $1 RETURNING *`, [comment_id])
        .then(({rows}) => {
            if(rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Comment not found."})
            }
            return rows;
        })
}

exports.updateCommentById = (body, comment_id) => {
    if(!comment_id) {
        return Promise.reject({ status: 404, msg: 'Comment not found.'})
    }
    return db.query(
        `UPDATE comments
        SET body = $1
        WHERE comment_id = $2
        RETURNING *`, [body, comment_id])
        .then(({ rows }) => {
            return rows[0];
        })
}