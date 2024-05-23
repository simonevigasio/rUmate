const auth = require("../middleware/authorize");
const { Preference, validate } = require("../models/preference");
const { User } = require("../models/user");
const { Advertisement } = require("../models/advertisement");
const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {
    const prefs = await Preference.find({});
    res.send(prefs)
});

router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({username: req.body.interested_user});
    if (!user) return res.status(400).send({message: "Interester username is not valid"});

    const ad = await Advertisement.findOne({_id: req.body.advertisement_id});
    if (!ad) return res.status(400).send({message: "Advertisement doesn't exist"});

    let prefs = await Preference.find({interested_user: req.body.interested_user});
    if (prefs.length == 3) return res.status(400).send({message: "The user has already 3 preferences"})

    let pref = prefs.filter((p) => {
        return p.advertisement_id == req.body.advertisement_id
    });
    if (!pref) return res.status(400).send({message: "The user have already set the preference on this advertisement"});

    pref = new Preference(req.body);
    await pref.save();

    return res.send(pref);
});

module.exports = router;