/*  
    tools imported for the declaration of the chat schema
    mongoose -> connection with MongoDB 
    Joi -> data validator for the schema
*/
const mongoose = require('mongoose');
const Joi = require("joi");
import { messageSchema } from './message';

// Creation of a new chat schema in the database
const chatSchema = new mongoose.Schema({
    senderId: {
        required: true,
        type: String
    },
    receiverId: {
        required: true,
        type: String
    },
    MessageList: {
        type: [messageSchema],
        default: []
    },
});

// The model is saved on mongoose and could now be used in the code
const Chat= mongoose.model("Chat", chatSchema);

function validateChat(chat) {
    const schema = Joi.object({
        senderId: Joi.required(),
        receiverId: Joi.required(),
    });

    return schema.validate(chat);
}

// export the Chat object
exports.Chat = Chat
exports.validateChat = validateChat