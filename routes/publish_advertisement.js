const { Advertisement, validate } = require("../models/advertisement");
const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let ad = await Advertisement.findOne({owner: req.body.owner});
    if (ad) return res.status(400).send("User already has an advertisement");

    advertisement = new Advertisement(_.pick(req.body, ["owner", "prize", "room", "flat_sex", "residence_zone", "expiry_date", "roommate"]));
    await advertisement.save();
});

module.exports = router;