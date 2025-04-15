const express = require("express");
const { handleCustomErorrs, handlePsqlErrors, handleServerErrors } = require("../controllers/errors.controllers");
const app = express();

app.use(express.json());

app.use(handleCustomErorrs);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

app.all('*', (req, res) => {
    res.status(404).send({ msg: 'Path not found.'});
})

module.exports = app;