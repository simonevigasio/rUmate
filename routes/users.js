const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const auth = require("../middleware/auth");
const express = require('express');
const { Advertisement } = require("../models/advertisement");
const { Preference } = require("../models/preference");
const router = express.Router();

// GET request used to access the user account, a middleware is applied 
router.get("/me", auth, async (req, res) => {

    // grasp from the database the user
    const user = await User.findById(req.user._id);

    // send back the user
    return res.send(user);
});

// GET the user given a specific id
router.get("/:id", async (req, res) => {

    // given the id of the user 
    const user = await User.findById(req.params.id);

    // send the result
    return res.send(user);
});

// GET the user given a specific username
router.get("/username/:username", async (req, res) => {

    // given the username of the user 
    const user = await User.findOne({ username: req.params.username });

    // send the result
    return res.send(user);
});

// POST request used for users to login
router.post("/", async (req, res) => {

    // check is the body of the request has all required information
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check is the user is logged in
    let user = await User.findOne({username: req.body.username});
    if (!user) return res.status(400).send({message: "Invalid username or password"});

    // hash with bcrypt the password and compare it with the hash stored inside the databse
    bcrypt.compare(req.body.password, user.password, function(err, result) {
        if (!result) return res.status(400).send("Invalid username or password");

        // generate a token to sent to the user
        const token = user.generateAuthToken();
        res.send({ "token": token });
    });
});

// POST to logout
router.post("/logout", (req, res) => res.redirect('/'));

// DELETE request to delete a specific user from the database
router.delete("/", auth, async (req, res) => {

    // delete the specific advertisement owned by the user
    const ad = await Advertisement.findOneAndDelete({ _id: req.user._id });

    // delete all the preferences related to the advertisement
    await Preference.deleteMany({ advertisement_id: ad._id });

    // find and delete the user
    const user = await User.findOneAndDelete({ _id: req.user._id });

    // verify whether the user exists
    if (!user) return res.status(404).send("User not found");

    // send back the user deleted
    return res.send(user);
});

// export api
module.exports = router;