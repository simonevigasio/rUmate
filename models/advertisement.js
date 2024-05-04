const mongoose = require('mongoose');
const Joi = require("joi");

const Sex_type = Object.freeze({ 
    Male: 0, 
    Female: 1,
    Mix: 2
}); 

const Room_type = Object.freeze({ 
    Single: 1, 
    Double: 2,
    Triple: 3
}); 

const Zone = Object.freeze({ 
    Povo: 0,
    Bondone: 1,
    Sardagna:2,
    Centro_storico_Piedicastello: 3,
    Meano: 4,
    Argentario: 5,
    San_Giuseppe_Santa_Chiara: 6,
    Oltrefersina: 7,
    Villazzano: 8,
    Mattarello: 9,
    Ravina_romagnano: 10,
    Oltrecastello: 11
}); 

const advertisementSchema = new mongoose.Schema({
    owner: {
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true,
        type: String
    },
    prize: {
        required: true,
        min: [0, 'Price can not be negative'],
        type: Number
    },
    room: {
        required: true,
        min: [1, 'There are only three types of room: single(1), double(2), triple(3)'],
        max: [3, 'There are only three types of room: single(1), double(2), triple(3)'],
        type: Number
    },
    flat_sex: {
        required: true,
        min: [0, 'There are only three types of sex: Male(0), Female(1), Mixed(2)'],
        max: [2, 'There are only three types of sex: Male(0), Female(1), Mixed(2)'],
        type: Number
    },
    residence_zone: {
        required: true,
        min: [0, 'Invalid residence zone'],
        max: [11, 'Invalid residence zone'],
        type: Number
    },
    expiry_date: {
        required: true,
        min: Date.now(),
        //max: Date.now() + 6 month,
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
    const schema = Joi.object({
        owner: Joi.string().min(3).max(50).required(),
        prize: Joi.string().min(0).required(),
        room: Joi.number().min(1).max(3).required(),
        flat_sex: Joi.number().min(0).max(2).required(),
        residence_zone: Joi.number().min(0).max(11).required(),
        expiry_date: Joi.date().min(Date.now).required(),
        roommate: Joi.number().min(0).required() 
    });

    return schema.validate(advertisement);
}

exports.Advertisement = Advertisement
exports.validate = validateAdvertisement