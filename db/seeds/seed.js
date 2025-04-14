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
    }).then(() => {
        return createDisciplineType();
    }).then(() => {
        return createRides();
    }).then(() => {
        return createComments();
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

function createDisciplineType() {
    return db.query(`CREATE TYPE discipline_type AS ENUM
         ('Downhill', 'Gravel', 'Mountain', 'Enduro', 'Cross-Country', 'Park', 'Casual')`)
}

function createRides() {
    return db.query(`CREATE TABLE rides(
        author REFERENCES users(username) ON DELETE CASCADE,
        ride_id SERIAL PRIMARY KEY,
        ride_location JSONB NOT NULL,
        created_at TIMESTAMP,
        ride_date DATE NOT NULL, 
        ride_time TIME NOT NULL,
        description VARCHAR(1000),
        discipline discipline_type,
        title VARCHAR(100) NOT NULL,
        public BOOLEAN DEFAULT true,
        participants INTEGER[] 
        )`) 
}
// ^^^ participants may need to be updated to UUID[] depending on what is going to be pushed here, the ride_location 
// datatype may need updating depending on how the map API needs to receive the data. This will also need updating in rides data (test and dev) if changed

function createComments() {
    return db.query(`CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY,
        ride_id INT REFERENCES rides(ride_id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        author VARCHAR(40) REFERENCES users(username) ON DELETE CASCADE,
        created_at TIMESTAMP
        )`)
}


module.export = seed;