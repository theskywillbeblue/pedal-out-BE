exports.postFriendship = (dbName, db, followerUsername, followingUsername) => {
    const doc = {
      followerUsername,
      followingUsername,
      createdAt: new Date(),
    };

    const envCollection = dbName === 'friends-test' ? 'test-friends-data' : 'dev-friends-data';
    const collection = db.collection(envCollection);
    return collection.findOne({
        followerUsername,
        followingUsername
    })
    .then((result) => {
        if(result) {
            return Promise.reject({status: 403, msg: 'Friendship already exists.'})
        }
        return collection.insertOne(doc)
    })
}

exports.getAllFollowers = (collectionName, db, username) => {
    try {
        const followingPromise = db.collection(collectionName).find({
            followerUsername: username
        }).toArray();

        const followerPromise = db.collection(collectionName).find({
                followingUsername: username
            }).toArray();

            return Promise.all([followingPromise, followerPromise])
                .then(([following, followers]) => {

                    const followedUsers = following.map((followedUser) => {
                        return followedUser.followingUsername;
                    })
                    const usersFollowers = followers.map((follower) => {
                        return follower.followerUsername;
                    })
                    return {followedUsers, usersFollowers};
                })
    } catch (err) {
        console.error('Error inside getAllFollowers:', err);
        throw err;
    }

}

exports.removeIndividualFriendship = (dbName, db, username, userToUnfollow) => {
    const envCollection = dbName === 'friends-test' ? 'test-friends-data' : 'dev-friends-data';
    const collection = db.collection(envCollection);
    return collection.deleteOne({
        followerUsername: username,
        followingUsername: userToUnfollow
    })
    .then((result) => {
        if(result.deletedCount === 0) {
            return Promise.reject({status: 404, msg: 'Friendship not found.'})
        }
        return result;
    })
}

exports.removeAllFriendships = (dbName, db, username) => {
    const envCollection = dbName === 'friends-test' ? 'test-friends-data' : 'dev-friends-data';
    const collection = db.collection(envCollection);
    const removeFollowing = collection.deleteMany({
        followerUsername: username
    });

    const removeFollowers = collection.deleteMany({
        followingUsername: username
    });

    return Promise.all([removeFollowing, removeFollowers])
    .then(([followingResult, followerResult]) => {
        if(followingResult.deletedCount === 0 && followerResult.deletedCount === 0) {
            return Promise.reject({status: 404, msg: 'No followers or following to delete.'})
        }
        return {followingResult, followerResult};
    })
}