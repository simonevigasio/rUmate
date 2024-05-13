const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const authorize = require("../middleware/authorize");
const express = require('express');
const router = express.Router();

router.get("/me", authorize, async (req, res) => {
    const user = await User.findById(req.user._id);
    res.send(_.pick(user, ["username"]));
});

router.post("/", async (req, res) => {
    const { error } = validate.local(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({username: req.body.username});
    if (!user) return res.status(400).send("Invalid username or password");

    bcrypt.compare(req.body.password, user.password, function(err, result) {
        if (!result) return res.status(400).send("Invalid username or password");

        const token = user.generateAuthToken();
        res.send({ "token": token });
    });
});

router.post("/logout", (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;