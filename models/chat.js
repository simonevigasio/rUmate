/*
    tools imported for the declaration of the chat schema
    mongoose -> connection with MongoDB 
    Joi -> data validator for the schema
*/
const mongoose = require('mongoose');
const Joi = require("joi");
const { messageSchema } = require('./message');

// Creation of a new chat schema in the database
const chatSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    messageList: {
        type: [messageSchema],
        default: []
    }
});

// The model is saved on mongoose and could now be used in the code
const Chat = mongoose.model("Chat", chatSchema);

// Export the Chat object
exports.Chat = Chat;
