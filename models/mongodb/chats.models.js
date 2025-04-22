const { connectToDB } = require("../../db/mongodb-connection.js");

exports.addNewMessage = (dbName, chatId, chatPartner, message, username) => {
    const doc = {
        chatId,
        participants: [username, chatPartner],
        sentBy: username,
        message,
        sentAt: new Date()
    }
    const envCollection = dbName === 'live-chat' ? 'chat-room-test' : 'chat-rooms';

    return connectToDB()
    .then((client) => {
        const db = client.db(dbName);
        const collection = db.collection(envCollection);
        return collection.insertOne(doc);
    })
}

exports.fetchAllMessages = (dbName, db, chatId) => {
    const envCollection = dbName === 'live-chat' ? 'chat-room-test' : 'chat-rooms';
    const collection = db.collection(envCollection);

    return collection.find({ chatId }).toArray()
    .then((messages) => {
        if(messages.length === 0) {
            return Promise.reject({status: 404, msg: 'No messages found.'})
        }
        return messages;
    })
}

exports.fetchAllChatsByUserId = (dbName, db, username) => {
    const envCollection = dbName === 'live-chat' ? 'chat-room-test' : 'chat-rooms';
    const collection = db.collection(envCollection);

    return collection.find({ participants: username})
    .sort({ 'sentAt': -1 }).toArray()
    .then((chats) => {
            const uniqueIds = [...new Set(chats.map((chat) => {
                return chat.chatId
            }))]
            return uniqueIds;
        })
}