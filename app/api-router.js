const apiRouter = require('express').Router();
const { getEndpoints } = require('../controllers/api.controllers.js');


const ridesRouter = require('./rides-router');
const commentsRouter = require('./comments-router');
const usersRouter = require('./users-router');

apiRouter.use('/', getEndpoints);

apiRouter.use('/rides', ridesRouter);

apiRouter.use('/comments', commentsRouter);

apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
