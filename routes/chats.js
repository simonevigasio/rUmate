const _ = require("lodash");
const auth = require("../middleware/authorize");
const { chat, validateChat } = require("../models/chat");
const { User, validate } = require("../models/user");
const { Message, validateMsg } = require("../models/message")
const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();

//GET MESSAGES -> se no crea la chat e la mostra vuota

// GET request to find a specific chat knowing its IDs
router.get("/:idChat", async (req, res) => {
    const chat = await Chat.findOne({senderId: req.body.senderId, receiverId: req.body.receiverId});
    if (!chat) return res.status(404).send("Chat not found");
    return res.send(chat);
});

// POST request to create a new chat in the database
router.post("/addChat", auth, async (req, res) => {
    // validate if the chat is correct, using the validate function
    const { error } = validateChat(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if the sender and the receiver associated with the chat both exist
    let sender = await User.findOne({username: req.body.senderId})
    if (!sender) return res.status(400).send("This sender does not exist");

    let receiver = await User.findOne({username: req.body.receiverId})
    if (!receiver) return res.status(400).send("This receiver does not exist");

    // check if another chat with the same IDs already exist in the Database
    let chat = await Chat.findOne({senderId: req.body.senderId, receiverId: req.body.receiverId});
    if (chat) return res.status(400).send("This chat has already been created");

    // load the chat in the Database
    chat = new Chat(_.pick(req.body, ["senderId", "receiverId", "messageList"]));
    await chat.save();

    return res.send(chat);
});

// POST request to add a message to a chat in the database
router.post("/addMessage", auth, async (req, res) => {
    // validate if the message is correct, using the validate function
    const { error } = validateMsg(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if the sender and the receiver associated with the chat both exist
    let sender = await User.findOne({username: req.body.senderId})
    if (!sender) return res.status(400).send("This sender does not exist");

    let receiver = await User.findOne({username: req.body.receiverId})
    if (!receiver) return res.status(400).send("This receiver does not exist");

    // check if the chat corresponding to the two users already exists, otherwise create it
    let chat = await Chat.findOne({senderId: req.body.senderId, receiverId: req.body.receiverId});
    if (!chat) chat = new Chat(_.pick(req.body, ["senderId", "receiverId", "messageList"]));

    // create the message object
    const message = _.pick(req.body, ["senderId", "receiverId", "content", "timestamp"]);

    // Add the message to the messageList of the chat
    chat.messageList.push(message);

    // Save the updated chat document
    await chat.save();

    return res.send(chat);
});

module.exports = router;