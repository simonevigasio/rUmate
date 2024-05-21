/*  
    tools imported for the declaration of the message schema
    mongoose -> connection with MongoDB 
    Joi -> data validator for the schema
*/
const mongoose = require('mongoose');
const Joi = require("joi");

// Creation of a new message schema in the database
const messageSchema = new mongoose.Schema({
    senderId: {
        required: true,
        type: String
    },
    receiverId: {
        required: true,
        type: String
    },
    content: {
        required: true,
        minlength: 1,
        maxlength: 255,
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});

// The model is saved on mongoose and could now be used in the code
const Message = mongoose.model("Message", messageSchema);

function validateMessage(message) {
    const schema = Joi.object({
        senderId: Joi.required(),
        receiverId: Joi.required(),
        content: Joi.string().min(1).max(255).required(),
        timestamp: Joi.date()
    });

    return schema.validate(message);
}

// export the Message object and the evaluation method
exports.Message = Message
exports.validateMessage = validateMessage