const apiRouter = require('express').Router();
const { getEndpoints } = require('../controllers/api.controllers.js');
const ridesRouter = require('./rides-router');
const commentsRouter = require('./comments-router');
const usersRouter = require('./users-router');
const friendsRouter = require('./friends-router.js');
const chatsRouter = require('./chats-router.js');

apiRouter.use('/rides', ridesRouter);

apiRouter.use('/comments', commentsRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/friends', friendsRouter);

apiRouter.use('/chats', chatsRouter);

apiRouter.use('/', getEndpoints);

module.exports = apiRouter;
