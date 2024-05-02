const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const path = require("path");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();

router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
});

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({username: req.body.username});
    if (user) return res.status(400).send("User already registered");

    user = new User(_.pick(req.body, ["username", "password"]));
    bcrypt.hash(user.password, 10, async function(err, hash) {
        if (err) return res.status(400).send("Invalid password");
        
        user.password = hash;
        await user.save();

        const token = user.generateAuthToken();
        res.header("X-Auth-Token", token).send(_.pick(user, ["_id", "username"]));
    });
});

module.exports = router;