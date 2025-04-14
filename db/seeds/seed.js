const db = require('../connection.js');
const format = require("pg-format");

const seed = ({userData, ridesData, commentsData}) => {
    return db.query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS users`)
    }).then(() => {
        return db.query(`DROP TABLE IF EXISTS rides`)
    }).then(() => {
        return createUsers();
    })
}


function createUsers() {
    return db.query(`CREATE TABLE users(
        full_name VARCHAR(100) NOT NULL,
        username VARCHAR(20) PRIMARY KEY,
        avatar_img VARCHAR(1000),
        public BOOLEAN DEFAULT true,
        created_at TIMESTAMP,
        location VARCHAR(100) NOT NULL
        )`)
}


module.exports = seed;