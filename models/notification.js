/*  
    tools imported for the declaration of the notification schema
    moment -> used to create Date object (YYYY MM DD)
    mongoose -> connection with MongoDB 
    Joi -> data validator for the schema
*/
const moment = require('moment');
const mongoose = require('mongoose');
const Joi = require("joi")
            .extend(require('@joi/date'));
Joi.objectId = require('joi-objectid')(Joi)

// Declaration of the schema and all its fields
const notificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message_type:{
        required: true,
        type: String,
        enum:['Preference', 'Message', 'System']                                   //system è da vedere
    },
    content: {
        required: true,
        maxlength: 500,
        type: String
    },
    sending_time: {
        required: true,
        min: moment().format("YYYY MM DD"),
        max: moment().format("YYYY MM DD"),
        type: Date
    }
});

// The model is saved on mongoose and could now be used in the code
const Notification = mongoose.model('Notification', notificationSchema);

// Validation function for an notification object, before inserting it in the Database
function validateNotification(notification) {
    const now = moment().format("YYYY MM DD");

    const schema = Joi.object({
        user_id: Joi.objectId().required(),
        message_type: Joi.string().valid('Preference', 'Message', 'System').required(),
        content: Joi.string().max(500).required(),
        sending_time: Joi.date().min(now).max(now).format("YYYY MM DD"),
    });

    return schema.validate(notification);
}

// Exporting the model Notification and the function validateNotification to allow modules which include this module to use them
exports.Notification = Notification
exports.validate = validateNotification