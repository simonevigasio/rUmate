const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    username: {
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true,
        type: String
    },
    password: {
        required: true,
        minlength: 5,
        maxlength: 255,
        type: String
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_TOKEN, { expiresIn: 5 * (60 * 60) });
    return token;
}

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        password: Joi.string().min(5).max(30).required()
    });

    return schema.validate(user);
}

exports.User = User
exports.validate = validateUser