/*  
    tools imported for the declaration of the advertisement schema
    jwt -> json web token lib
    mongoose -> connection with MongoDB 
    Joi -> data validator for the schema
*/
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const Joi = require("joi");

// schema user into the database for the user
// the user can access through the hashed password or google id
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

// method of the user object able to generate a new json web token for eccess personal areas
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_TOKEN, { expiresIn: 5 * (60 * 60) });
    return token;
}

// The model is saved on mongoose and could now be used in the code
const User = mongoose.model("User", userSchema);

// method used for validating the user when he/she wants to signup/login with password
function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        password: Joi.string().min(5).max(30).required(),
    });

    return schema.validate(user);
}

// mathos used for validating the user when he/she wants to authenticate with google 
function validateGoogleUser(user) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        googleId: Joi.string().required(),
    });

    return schema.validate(user);
}

// incorporare both validation methods into a unique object
const validate = { local: validateUser, google: validateGoogleUser };

// export the User object and valudation methods
exports.User = User
exports.validate = validate