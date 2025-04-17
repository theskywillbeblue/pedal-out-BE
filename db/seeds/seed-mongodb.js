const { connectToDB } = require('../mongodb-connection.js');

exports.seedTestData = async () => {
  const client = await connectToDB();
  const db = client.db('friends-test');
  const collection = db.collection('test-friends-data');

  await collection.deleteMany({});

  await collection.insertMany([
    {
      followerUsername: 'testUser1',
      followingUsername: 'testUser2',
      createdAt: new Date()
    },
    {
      followerUsername: 'testUser3',
      followingUsername: 'testUser4',
      createdAt: new Date()
    },
    {
      followerUsername: 'testUser1',
      followingUsername: 'testUser5',
      createdAt: new Date()
    },
    {
      followerUsername: 'testUser2',
      followingUsername: 'testUser3',
      createdAt: new Date()
    },
    {
      followerUsername: 'testUser4',
      followingUsername: 'testUser1',
      createdAt: new Date()
    },
    {
      followerUsername: 'testUser5',
      followingUsername: 'testUser2',
      createdAt: new Date()
    },
    {
      followerUsername: 'testUser1',
      followingUsername: 'testUser3',
      createdAt: new Date()
    },
    {
      followerUsername: 'testUser3',
      followingUsername: 'testUser5',
      createdAt: new Date()
    },
    {
      followerUsername: 'testUser4',
      followingUsername: 'testUser2',
      createdAt: new Date()
    },
    {
      followerUsername: 'testUser1',
      followingUsername: 'testUser6',
      createdAt: new Date()
    }
  ]);
};