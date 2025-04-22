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

exports.seedTestChatData = async () => {
  const client = await connectToDB();
  const db = client.db('live-chat');
  const collection = db.collection('chat-room-test');

  await collection.deleteMany({});

  await collection.insertMany([
    {
      chatId: "chat_001",
      participants: ["testUser1", "testUser2"],
      sentBy: "testUser1",
      message: "Hey there! How's your day going?",
      sentAt: new Date("2025-04-16T10:15:23Z")
    },
    {
      chatId: "chat_001",
      participants: ["testUser1", "testUser2"],
      sentBy: "testUser2",
      message: "Hi! It's going well, thanks for asking. Just working on that new project we discussed.",
      sentAt: new Date("2025-04-16T10:16:45Z")
    },
    {
      chatId: "chat_001",
      participants: ["testUser1", "testUser2"],
      sentBy: "testUser1",
      message: "That's great to hear! Need any help with it?",
      sentAt: new Date("2025-04-16T10:18:12Z")
    },
    {
      chatId: "chat_001",
      participants: ["testUser1", "testUser2"],
      sentBy: "testUser2",
      message: "I might later, will let you know. Thanks for offering!",
      sentAt: new Date("2025-04-16T10:19:30Z")
    },
    {
      chatId: "chat_002",
      participants: ["testUser3", "testUser4"],
      sentBy: "testUser3",
      message: "Did you see the latest feature release?",
      sentAt: new Date("2025-04-15T14:22:10Z")
    },
    {
      chatId: "chat_002",
      participants: ["testUser3", "testUser4"],
      sentBy: "testUser4",
      message: "Not yet, what's new?",
      sentAt: new Date("2025-04-15T14:25:33Z")
    },
    {
      chatId: "chat_002",
      participants: ["testUser3", "testUser4"],
      sentBy: "testUser3",
      message: "They finally added that dark mode we've been asking for!",
      sentAt: new Date("2025-04-15T14:26:15Z")
    },
    {
      chatId: "chat_002",
      participants: ["testUser3", "testUser4"],
      sentBy: "testUser4",
      message: "No way! That's awesome!",
      sentAt: new Date("2025-04-15T14:27:05Z")
    },
    {
      chatId: "chat_002",
      participants: ["testUser3", "testUser4"],
      sentBy: "testUser3",
      message: "Yeah, and it looks really clean too. Check it out when you get a chance.",
      sentAt: new Date("2025-04-15T14:28:44Z")
    },
    {
      chatId: "chat_002",
      participants: ["testUser3", "testUser4"],
      sentBy: "testUser4",
      message: "Will do right now, thanks for the heads up!",
      sentAt: new Date("2025-04-15T14:29:22Z")
    },
    {
      chatId: "chat_003",
      participants: ["testUser1", "testUser3"],
      sentBy: "testUser1",
      message: "Are we still on for the meeting at 3pm?",
      sentAt: new Date("2025-04-17T09:03:45Z")
    },
    {
      chatId: "chat_003",
      participants: ["testUser1", "testUser3"],
      sentBy: "testUser3",
      message: "Yes, I'll be there. I've prepared the slides as we discussed.",
      sentAt: new Date("2025-04-17T09:05:12Z")
    }
  ]);
};