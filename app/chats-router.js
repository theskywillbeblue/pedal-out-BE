const express = require("express");
const { postNewMessage, getAllMessages, findAllChatsByUserId } = require("../controllers/mongodb/chats.controllers.js");

const chatsRouter = express.Router();

chatsRouter
.route('/:chatId')
.get(getAllMessages)
.post(postNewMessage);

chatsRouter
.route('/')
.post(postNewMessage)
.get(findAllChatsByUserId);

module.exports = chatsRouter;