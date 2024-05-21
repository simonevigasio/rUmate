const _ = require("lodash");
const auth = require("../middleware/authorize");
const { Chat } = require("../models/chat");
const { User } = require("../models/user");
const { Message, validateMessage } = require("../models/message");
const express = require('express');
const router = express.Router();

// GET request to get all messages exchanged with a specified user; if chat doesn't exist, create it and show it empty
router.get("/messages", async (req, res) => {
    const sender = await User.findOne({ username: req.query.sender });
    if (!sender) return res.status(400).send("This sender does not exist");

    const receiver = await User.findOne({ username: req.query.receiver });
    if (!receiver) return res.status(400).send("This receiver does not exist");

    if (sender.username === receiver.username) return res.status(400).send("The sender and the receiver can't be the same users");

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

// POST request to add a message to a chat in the database; if chat doesn't exist, create it
router.post("/addMessage", auth, async (req, res) => {
    const { error } = validateMessage(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const sender = await User.findOne({ username: req.body.senderId });
    if (!sender) return res.status(400).send("This sender does not exist");

    const receiver = await User.findOne({ username: req.body.receiverId });
    if (!receiver) return res.status(400).send("This receiver does not exist");

    if (sender.username === receiver.username) return res.status(400).send("The sender and the receiver can't be the same users");

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

    const message = new Message(_.pick(req.body, ["senderId", "receiverId", "content", "timestamp"]));
    chat.messageList.push(message);
    await chat.save();

    return res.send(chat);
});

module.exports = router;
