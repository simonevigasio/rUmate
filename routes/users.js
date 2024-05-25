/*  
    tools imported for the declaration of RESTful requests 
    bcrypt -> import a lib used for encript and the password of the user
    _ -> import lodash lib useful to manipulate objects and lists
    auth -> import a function used to check if the user is authenticated
    User, validate  -> import a model and a function from the user module
    express -> is a framework for Node.js
    router -> import the RESTful requests 
*/
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const auth = require("../middleware/auth");
const express = require('express');
const router = express.Router();

// GET request used to access the user account, a middleware is applied 
router.get("/me", auth, async (req, res) => {
    // grasp from the database the used
    const user = await User.findById(req.user._id);
    res.send(_.pick(user, ["username"]));
});

// GET the username from any id
router.get("/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    res.send(_.pick(user, ["username"]));
});

// POST request used for login users
router.post("/", async (req, res) => {
    // check is the body of the request has all required information
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check is the user is logged in
    let user = await User.findOne({username: req.body.username});
    if (!user) return res.status(400).send({message: "Invalid username or password"});

    // hash with bcrypt the password and compare it with the hash stored inside the databse
    bcrypt.compare(req.body.password, user.password, function(err, result) {
        if (!result) return res.status(400).send({message: "Invalid username or password"});

        // generate a token to sent to the user
        const token = user.generateAuthToken();
        res.send({ "token": token });
    });
});

// POST request used to logout
router.post("/logout", (req, res) => {
    res.redirect('/');
});

module.exports = router;