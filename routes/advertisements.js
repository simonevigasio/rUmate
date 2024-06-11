const _ = require("lodash");
const auth = require("../middleware/auth");
const { Advertisement, validate } = require("../models/advertisement");
const { Preference } = require("../models/preference");
const express = require('express');
const router = express.Router();

// GET a specific advertisement given the user id
router.get("/my-ad", auth, async (req, res) => {

    // get from the database the advertisement given the user id
    const ad = await Advertisement.findOne({ user_id: req.user._id });

    // verify whether the advertisement exists
    if (!ad) return res.status(404).send("Advertisement not found");

    // send the result
    return res.send(ad);
});

// GET ads using filters and sorting options
router.get("/", async (req, res) => {

    // set all the ads from the database
    const query = Advertisement.find();

    // apply filters if selected
    if (req.query.roomFilter) query.in("room", JSON.parse(req.query.roomFilter));
    if (req.query.sexFilter) query.in("flat_sex", JSON.parse(req.query.sexFilter));
    if (req.query.residenceFilter) query.in("residence_zone", JSON.parse(req.query.residenceFilter));

    // sort the ads filtered
    const sort = req.query.sort;
    if (sort == "Price") query.sort({ price: "asc" });
    else if (sort == "Expiry_date") query.sort({ expiry_date: "asc" });

    // execute command set 
    const ads = await query.exec();

    // send the retult
    return res.send(ads);
});

// GET a specific advertisement given its id
router.get("/:id", async (req, res) => {

    // get from the database the advertisment
    const ad = await Advertisement.findOne({_id: req.params.id});

    // verify whether the advertisement exists
    if (!ad) return res.status(404).send("Advertisement not found");

    // send the result
    return res.send(ad);
});

// POST request to add an advertisement in the database
router.post("/", auth, async (req, res) => {
    // validate if the advertisement is correct, using the validate function
    req.body.user_id = req.user._id;
    const { error } = validate(req.body);
    if (error) return res.status(400).send("Some fields are blank/incorrect");

    // check if exist another advertisement in the Database with the same owner
    let ad = await Advertisement.findOne({user_id: req.body.user_id});
    if (ad) return res.status(400).send("User already has an advertisement published");

    // load the advertisement in the Database
    ad = new Advertisement(req.body);
    await ad.save();

    // send the result
    return res.send(ad);
});

// DELETE a specific advertisement 
router.delete("/", auth, async (req, res) => {

    // find the advertisement by its id and delete it
    const ad = await Advertisement.findOneAndDelete({ user_id: req.user._id });

    // verify whether the advertisement exists
    if (!ad) return res.status(404).send("Advertisement not found");

    // detele all the preferences related to that advertisement
    await Preference.deleteMany({ advertisement_id: ad._id });

    // send back the advertisement deleted
    return res.send(ad);
});

// export api
module.exports = router;