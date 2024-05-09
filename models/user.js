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
        minlength: 5,
        maxlength: 255,
        type: String
    },
    googleId: {
        type: String,
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
        password: Joi.string().min(5).max(30).required(),
    });

    return schema.validate(user);
}

function validateGoogleUser(user) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        googleId: Joi.string().required(),
    });

    return schema.validate(user);
}

const validate = { local: validateUser, google: validateGoogleUser };

exports.User = User
exports.validate = validate