const mongoose = require('mongoose');
const Joi = require("joi")
            .extend(require('@joi/date'));
Joi.objectId = require('joi-objectid')(Joi)

const notificationSchema = new mongoose.Schema({
    reciver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type:{
        required: true,
        type: String,
        enum:["Preference", "Message"]
    },
    content: {
        required: true,
        maxlength: 500,
        type: String
    },
    date: {
        required: true,
        type: Date
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

function validateNotification(notification) {
    const schema = Joi.object({
        reciver_id: Joi.objectId().required(),
        sender_id: Joi.objectId().required(),
        type: Joi.string().valid('Preference', 'Message').required(),
        content: Joi.string().max(500).required(),
        date: Joi.date().format("YYYY MM DD"),
    });

    return schema.validate(notification);
}

exports.Notification = Notification
exports.validate = validateNotification