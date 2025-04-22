const express = require("express");
const { postNewMessage, getAllMessages, findAllChatsByUserId } = require("../controllers/mongodb/chats.controllers.js");

const chatsRouter = express.Router();

chatsRouter
.route('/:chatId')
.get((req, res, next) => {
    console.log('get route hit');
    next();
}, getAllMessages)
.post(postNewMessage);

chatsRouter
.route('/')
.post(postNewMessage)
.get((req, res, next) => {
    console.log('get route hit wrong');
    next();
}, findAllChatsByUserId);

module.exports = chatsRouter;