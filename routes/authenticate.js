/*  
    tools imported for the declaration of RESTful requests 
    bcrypt -> import a lib used for encript and the password of the user
    _ -> import lodash lib useful to manipulate objects and lists
    User, validate  -> import a model and a function from the user module
    express -> is a framework for Node.js
    router -> import the RESTful requests 
*/
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const passport = require("passport");
const express = require('express');
const router = express.Router();

// POST request used to register into rUmate
router.post("/", async (req, res) => {
    // check if the body of the request has all requered information
    const { error } = validate.local(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if the user is already registered
    let user = await User.findOne({username: req.body.username});
    if (user) return res.status(400).send({message: "User already registered"});

    // create a new User oebject to store into the database
    user = new User(_.pick(req.body, ["username", "password"]));

    // hash the password given by the user 
    bcrypt.hash(user.password, 10, async function(err, hash) {
        if (err) return res.status(400).send({message: "Invalid password"});
        
        // if the password is hashable save the hash in the database 
        user.password = hash;
        await user.save();
        
        // generate a json-web-token and sent it into the header of the response
        const token = user.generateAuthToken();
        res.header("X-Auth-Token", token).send(_.pick(user, ["_id", "username"]));
    });
});

module.exports = router;