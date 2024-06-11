// middleware used to verify that the user is authenticated correctly
const auth = require("../middleware/auth");

// mongodb modules
const { Preference, validate } = require("../models/preference");
const { User } = require("../models/user");
const { Advertisement } = require("../models/advertisement");

// router instantiation
const express = require('express');
const router = express.Router();

// this api (GET) gathers all the preferences of an advertisement published by a specific user
router.get("/my-adv", auth, async (req, res) => {

    // get the published advertisement of the authenticated user who is the owner of such advertisement
    const ad = await Advertisement.findOne({user_id: req.user._id});
    if (!ad) return res.status(400).send({ message: "There is no advertisement published by this user in the database"});
    
    // find all preferences of that advertisement
    const prefs = await Preference.find({advertisement_id: ad._id});

    // send back the list of all preferences found
    return res.send(prefs)
});

// this api (GET) gathers all the preferences of a user
router.get("/my-prefs", auth, async (req, res) => {

    // find all the preferences of the following user
    const prefs = await Preference.find({interested_user_id: req.user._id});
    if (!prefs) return res.status(400).send({ message: "There are no preferences related to the user in the database"});

    // send back the list of all preferences found
    return res.send(prefs)
});

// this api (POST) creates a new preference between an interested user and one advertisement
router.post("/", auth, async (req, res) => {

    // add the user id from the json-web-token 
    req.body.interested_user_id = req.user._id

    // validate the content of the body
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // verify that the user exists
    const user = await User.findOne({_id: req.body.interested_user_id});
    if (!user) return res.status(400).send({message: "Interested user id is not valid"});
    
    // verify that the advertisement exists
    const ad = await Advertisement.findOne({_id: req.body.advertisement_id});
    if (!ad) return res.status(400).send({message: "Advertisement does not exist"});

    // verify whether the user is the owner of the advertisement
    if (ad.user_id == user._id) return res.status(400).send({message: "The user is the onwer of the advertisement"});

    // verify whether the user exceeds the number of preferences
    const prefs = await Preference.find({interested_user_id: req.body.interested_user_id});
    if (prefs.length == 3) return res.status(400).send({message: "The user has already 3 preferences"})
    
    // verify whether the user has already signed the preference on that advertisement
    let pref = prefs.filter((p) => p.advertisement_id == req.body.advertisement_id);
    if (pref.length != 0) return res.status(400).send({message: "The user has already signed the preference for this advertisement"});

    // create and save a new preference in the database
    pref = new Preference(req.body);
    await pref.save();

    // send back the new preference saved in the database
    return res.send(pref);
});

// DELETE request to delete a specific preference from the database
router.delete("/:id", async (req, res) => {

    // find the preference and delete it
    const pref = await Preference.findOneAndDelete({ _id: req.params.id });

    // verify whether the preference exists
    if (!pref) return res.status(404).send("Preference not found");
    
    // send back the preference deleted
    return res.send(pref);
});

// export the apis
module.exports = router;