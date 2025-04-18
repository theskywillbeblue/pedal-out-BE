const express = require("express");
const { createFriendship, findAllFollowersAndFollowing, deleteIndividualFriendship, deleteAllRelationships } = require("../controllers/mongodb/friends.controllers");

const friendsRouter = express.Router();

friendsRouter
.route('/:username')
.post(createFriendship)
.get(findAllFollowersAndFollowing)
.delete(deleteIndividualFriendship);

friendsRouter
.route('/')
.delete(deleteAllRelationships)

module.exports = friendsRouter;