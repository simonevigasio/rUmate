const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const passport = require("passport");
const express = require('express');
const router = express.Router();

router.post("/", async (req, res) => {
    const { error } = validate.local(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({username: req.body.username});
    if (user) return res.status(400).send({message: "User already registered"});

    user = new User(_.pick(req.body, ["username", "password"]));
    bcrypt.hash(user.password, 10, async function(err, hash) {
        if (err) return res.status(400).send({message: "Invalid password"});
        
        user.password = hash;
        await user.save();

        const token = user.generateAuthToken();
        res.header("X-Auth-Token", token).send(_.pick(user, ["_id", "username"]));
    });
});

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

router.get("/google/callback", passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  return res.redirect("/");
});

module.exports = router;