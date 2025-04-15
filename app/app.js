const express = require("express");

const app = express()
app.use(express.json());
const cors = require ('cors')

const { handleCustomErorrs, handlePsqlErrors, handleServerErrors } = require("../controllers/errors.controllers");
const app = express();


app.use(express.json());

app.use(handleCustomErorrs);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

app.all('*', (req, res) => {
    res.status(404).send({ msg: 'Path not found.'});
})

// routers

app.use(cors())

const apiRouter = require("./api-router")
const ridesRouter = require("./routes/rides-router")
const commentsRouter = require("./routes/comments-router")
const usersRouter = require("./routes/users-router");


// endpoints

app.use("/api", apiRouter)

app.use("/api/rides", ridesRouter)

app.use("/api/comments", commentsRouter)

app.use("/api/users", usersRouter)



// error handling





module.exports = app