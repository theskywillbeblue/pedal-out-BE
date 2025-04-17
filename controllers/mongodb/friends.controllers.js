const { connectToDB } = require("../../db/mongodb-connection.js");
const { postFriendship, getAllFollowers, removeIndividualFriendship, removeAllFriendships } = require("../../models/mongodb/friends.models.js");

exports.createFriendship = (req, res, next) => {
    const env = process.env.NODE_ENV || 'development';
    const dbName = env === 'test' ? 'friends-test' : 'friends-dev';
    const { followingUsername } = req.body;
    const { username } = req.params;
    
    connectToDB()
        .then((client) => {
            const db = client.db(dbName);
            return postFriendship(dbName, db, username, followingUsername )
        })
        .then((result) => {
            res.status(201).send({ friendshipId: result.insertedId });
        })
        .catch((err) => {
            next(err);
        })
}

exports.findAllFollowersAndFollowing = (req, res, next) => {
    const env = process.env.NODE_ENV || 'development';
    const dbName = env === 'test' ? 'friends-test' : 'friends-dev';
    const collectionName = env === 'test' ? 'test-friends-data' : 'dev-friends-data';
    const { username } = req.params;

    connectToDB()
        .then((client) => {
            const db = client.db(dbName);
            return getAllFollowers(collectionName, db, username)
        })
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            next(err);
        })
}

exports.deleteIndividualFriendship = (req, res, next) => {
    const env = process.env.NODE_ENV || 'development';
    const dbName = env === 'test' ? 'friends-test' : 'friends-dev';
    const { username } = req.params;
    const { followingUsername } = req.body;
    connectToDB()
        .then((client) => {
            const db = client.db(dbName);
            return removeIndividualFriendship(dbName, db, username, followingUsername)
        })
        .then((result) => {
            res.status(204).send(result);
        })
        .catch((err) => {
            next(err);
        })
}

exports.deleteAllRelationships = (req, res, next) => {
    const env = process.env.NODE_ENV || 'development';
    const dbName = env === 'test' ? 'friends-test' : 'friends-dev';
    const { username } = req.body;

    connectToDB()
        .then((client) => {
            const db = client.db(dbName);
            return removeAllFriendships(dbName, db, username)
        })
        .then((result) => {
            res.status(204).send(result);
        })
        .catch((err) => {
            next(err);
        })
}