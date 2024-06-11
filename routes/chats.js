const _ = require("lodash");
const auth = require("../middleware/auth");
const { Chat, validateChat } = require("../models/chat");
const { User } = require("../models/user");
const { Message, validateMessage } = require("../models/message");
const express = require('express');
const router = express.Router();

// GET request to get all chats of a specific user
router.get("/:userId", async (req, res) => {
   
    const chats = await Chat.find({
        $or: [
            { senderId: req.params.userId },
            { receiverId: req.params.userId }
        ]
    });

    console.log(chats.lenght);
    if(chats.length === 0){
        res.status(204).send("There are no chat started for this user yet")
    }else return res.send(chats);
});

// GET request to get all messages exchanged between two specific users
router.get("/:senderId/:receiverId", async (req, res) => {
    // check if both the sender and the receiver are existing users
    const sender = await User.findOne({ username: req.params.senderId });
    if (!sender) return res.status(400).send("This sender does not exist");

    const receiver = await User.findOne({ username: req.params.receiverId });
    if (!receiver) return res.status(400).send("This receiver does not exist");

    // check if the sender and the receiver are the same user; if so, error
    if (req.params.senderId === req.params.receiverId) return res.status(400).send("The sender and the receiver can't be the same users");

    // check if a chat between the two users already exists, otherwise create it and store it
    let chat = await Chat.findOne({
        $or: [
            { senderId: req.params.senderId, receiverId: req.params.receiverId },
            { senderId: req.params.receiverId, receiverId: req.params.senderId }
        ]
    });

    if (!chat){
        return res.status(204).send("There are no messages exchanged between these two users yet");
    }else return res.send(chat.messageList);
});

// POST request to add a chat in the database; if the chat already exists, error
router.post("/:senderId/addChat/:receiverId", auth, async (req, res) => {
     // validate the chat
     const { error } = validateChat(req.body);
     if (error) return res.status(400).send(error.details[0].message);

    // check if both the sender and the receiver are existing users
    const sender = await User.findOne({ username: req.body.senderId });
    if (!sender) return res.status(400).send("This sender does not exist");

    const receiver = await User.findOne({ username: req.body.receiverId });
    if (!receiver) return res.status(400).send("This receiver does not exist");

    // check if the sender and the receiver are the same user; if so, error
    if (req.body.senderId === req.body.receiverId) return res.status(400).send("The sender and the receiver can't be the same users");

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
    }else return res.status(400).send("A chat between these two users already exists");

    return res.send(chat);
});

// POST request to add a message to a chat in the database; if the chat doesn't exist, create it
router.post("/:senderId/addMessage/:receiverId", auth, async (req, res) => {
    // validate the message
    const { error } = validateMessage(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if both the sender and the receiver are existing users
    const sender = await User.findOne({ username: req.body.senderId });
    if (!sender) return res.status(400).send("This sender does not exist");

    const receiver = await User.findOne({ username: req.body.receiverId });
    if (!receiver) return res.status(400).send("This receiver does not exist");
    
    // check if the sender and the receiver are the same user; if so, error
    if (req.body.senderId == req.body.receiverId) return res.status(400).send("The sender and the receiver can't be the same users");

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

// DELETE request to delete a specific chat from the database knowing its users' IDs
router.delete("/:senderId/:receiverId", async (req, res) => {
    // find the chat by its users' IDs and delete it
    const chat = await Chat.findOneAndDelete({senderId: req.params.senderId, receiverId: req.params.receiverId});
    if (!chat) return res.status(404).send("Chat not found");
    return res.send(chat);
});

module.exports = router;
