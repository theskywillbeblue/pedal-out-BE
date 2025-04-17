const express = require("express");
const { createFriendship, findAllFollowersAndFollowing, deleteIndividualFriendship, deleteAllRelationships } = require("../controllers/mongodb/friends.controllers");

const friendsRouter = express.Router();

friendsRouter
.route('/:username')
.post(createFriendship)
.get((req, res, next) => {
    console.log('about to call findAll function');
    next();
}, findAllFollowersAndFollowing)
.delete(deleteIndividualFriendship);

friendsRouter
.route('/')
.delete(deleteAllRelationships)

module.exports = friendsRouter;