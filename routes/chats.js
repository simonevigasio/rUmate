/*  
    tools imported for the declaration of RESTful requests 
    auth -> import a function used to check if the user is authenticated
    Chat -> import a model and a function from the chat module
    User  -> import a model and a function from the user module
    Message, validateMessage  -> import a model and a function from the message module
    mongoose -> connection with MongoDB 
    express -> is a framework for Node.js
    router -> import the RESTful requests 

*/
const _ = require("lodash");
const auth = require("../middleware/authorize");
const { Chat } = require("../models/chat");
const { User } = require("../models/user");
const { Message, validateMessage } = require("../models/message");
const express = require('express');
const router = express.Router();

// GET request to get all messages exchanged with a specified user; if the chat doesn't exist, create it and show it empty
router.get("/messages", async (req, res) => {
    // check if both the sender and the receiver are existing users
    const sender = await User.findOne({ username: req.query.sender });
    if (!sender) return res.status(400).send("This sender does not exist");

    const receiver = await User.findOne({ username: req.query.receiver });
    if (!receiver) return res.status(400).send("This receiver does not exist");

    // check if the sender and the receiver are the same user; if so, error
    if (sender.username === receiver.username) return res.status(400).send("The sender and the receiver can't be the same users");

    // check if a chat between the two users already exists, otherwise create it and store it
    let chat = await Chat.findOne({
        $or: [
            { senderId: req.query.sender, receiverId: req.query.receiver },
            { senderId: req.query.receiver, receiverId: req.query.sender }
        ]
    });

    if (!chat) {
        chat = new Chat({ senderId: req.query.sender, receiverId: req.query.receiver, messageList: [] });
        await chat.save();
    }

    return res.send(chat.messageList);
});

// GET request to get all chats of a specified user
router.get("/UserChats", async (req, res) => {
   
    const chats = await Chat.find({
        $or: [
            { senderId: req.query.user },
            { receiverId: req.query.user }
        ]
    });

    return res.send(chats);
});

// POST request to add a message to a chat in the database; if the chat doesn't exist, create it
router.post("/addMessage", auth, async (req, res) => {
    // validate the message
    const { error } = validateMessage(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if both the sender and the receiver are existing users
    const sender = await User.findOne({ username: req.body.senderId });
    if (!sender) return res.status(400).send("This sender does not exist");

    const receiver = await User.findOne({ username: req.body.receiverId });
    if (!receiver) return res.status(400).send("This receiver does not exist");

    // check if the sender and the receiver are the same user; if so, error
    if (sender.username === receiver.username) return res.status(400).send("The sender and the receiver can't be the same users");

    // check if a chat between the two users already exists, otherwise create it and store it
    let chat = await Chat.findOne({
        $or: [
            { senderId: req.body.senderId, receiverId: req.body.receiverId },
            { senderId: req.body.receiverId, receiverId: req.body.senderId }
        ]
    });

    if (!chat) {
        chat = new Chat({ senderId: req.body.senderId, receiverId: req.body.receiverId, messageList: [] });
        await chat.save();
    }

    // create the message and store it in the message list of the corresponding chat
    const message = new Message(_.pick(req.body, ["senderId", "receiverId", "content", "timestamp"]));
    chat.messageList.push(message);
    await chat.save();

    return res.send(chat);
});

module.exports = router;
