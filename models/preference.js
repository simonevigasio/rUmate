const mongoose = require('mongoose');
const Joi = require("joi")
Joi.objectId = require('joi-objectid')(Joi)

const preferenceSchema = new mongoose.Schema({
    advertisement_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Advertisement"
    },
    interested_user: {
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true,
        type: String
    },
});

const Preference = mongoose.model("Preference", preferenceSchema);

function validatePreference(preference) {
    const schema = Joi.object({
        advertisement_id: Joi.objectId().required(),
        interested_user: Joi.string().required()
    });

    return schema.validate(preference);
}

exports.Preference = Preference
exports.validate = validatePreference