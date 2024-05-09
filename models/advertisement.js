const { times } = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
const Joi = require("joi")
            .extend(require('@joi/date'));

const advertisementSchema = new mongoose.Schema({
    owner: {
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true,
        type: String
    },
    title: {
        required: true,
        minlength: 5,
        maxlength: 100,
        type: String
    },
    description: {
        required: true,
        maxlength: 500,
        type: String
    },
    prize: {
        required: true,
        min: [0, 'Price can not be negative'],
        type: Number
    },
    room: {
        required: true,
        type: String,
        enum:['Single', 'Double', 'Triple']
    },
    flat_sex: {
        required: true,
        type: String,
        enum:['Male', 'Female', 'Mixed']
    },
    residence_zone: {
        required: true,
        type: String,
        enum: ['Povo','Bondone','Sardagna','Centro_storico_Piedicastello',
        'Meano','Argentario','San_Giuseppe_Santa_Chiara','Oltrefersina',
        'Villazzano','Mattarello','Ravina_romagnano','Oltrecastello']
    },
    expiry_date: {
        required: true,
        min: moment().format("YYYY MM DD"),
        max: moment().add(6, "M").format("YYYY MM DD"),
        type: Date
    },
    roommate: {
        required: true,
        min: [0, 'Roommate number must be positive'],
        type: Number
    }
});

const Advertisement = mongoose.model('Advertisement', advertisementSchema);

function validateAdvertisement(advertisement) {
    const now = moment().format("YYYY MM DD");
    const limit = moment().add(6, "M").format("YYYY MM DD");

    const schema = Joi.object({
        owner: Joi.string().min(3).max(50).required(),
        title: Joi.string().min(5).max(100).required(),
        description: Joi.string().max(500).required(),
        prize: Joi.string().min(0).required(),
        room: Joi.string().valid('Single', 'Double', 'Triple').required(),
        flat_sex: Joi.string().valid('Male', 'Female', 'Mixed').required(),
        residence_zone: Joi.string().valid('Povo','Bondone','Sardagna','Centro_storico_Piedicastello',
        'Meano','Argentario','San_Giuseppe_Santa_Chiara','Oltrefersina',
        'Villazzano','Mattarello','Ravina_romagnano','Oltrecastello').required(),
        expiry_date: Joi.date().min(now).max(limit).format("YYYY MM DD"),
        roommate: Joi.number().min(0).required() 
    });

    return schema.validate(advertisement);
}

exports.Advertisement = Advertisement
exports.validate = validateAdvertisement