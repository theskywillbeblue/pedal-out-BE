const express = require('express');
const app = express();
const cors = require('cors');
const {
	handleCustomErrors,
	handlePsqlErrors,
	handleServerErrors,
	handleMongoErrors,
} = require('../controllers/errors.controllers');
const apiRouter = require('./api-router');

app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleMongoErrors);

app.use(handleServerErrors);


app.all(/(.*)/, (req, res) => {
	res.status(404).send({ msg: 'Path not found.' });
});

app.use((err, req, res, next) => {
	console.error('Global error handler caught:', err);
	res.status(err.status || 500).send({ msg: err.msg || 'Server error.' });
  });

module.exports = app;
