const express = require('express');
const app = express();
const cors = require('cors');
const {
	handleCustomErrors,
	handlePsqlErrors,
	handleServerErrors,
} = require('../controllers/errors.controllers');
const apiRouter = require('./api-router');
app.use(cors());

app.use(express.json());

// endpoints

app.use('/api', apiRouter);



// error handling


app.all(/(.*)/, (req, res) => {
	res.status(404).send({ msg: 'Path not found.' });
});

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);



module.exports = app;
