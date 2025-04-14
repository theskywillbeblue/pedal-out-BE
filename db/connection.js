const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || 'development'

require('dotenv').config({path: `${__dirname}/../.env.${ENV}`})

if(!process.env.PGDATABASE) {
    throw new Error("PGDATABASE not configured")
} else {
    console.log(`Connected to ${process.env.PGDATABASE}`)
}

const config = {};

const db = new Pool(config);

module.exports = db;