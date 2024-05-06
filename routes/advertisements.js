const _ = require("lodash");
const auth = require("../middleware/auth");
const { Advertisement, validate } = require("../models/advertisement");
const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {
    const ads = await Advertisement.find({});
    res.send(ads);
});

router.get("/:id", async (req, res) => {
    const ad = await Advertisement.findOne({_id: req.params.id});
    if (!ad) return res.status(404).send("Advertisement not found");
    return res.send(ad);
});

router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let ad = await Advertisement.findOne({owner: req.body.owner});
    if (ad) return res.status(400).send("User already has an advertisement");

    advertisement = new Advertisement(_.pick(req.body, ["owner", "prize", "room", "flat_sex", "residence_zone", "expiry_date", "roommate"]));
    await advertisement.save();

    return res.send(advertisement);
});

module.exports = router;