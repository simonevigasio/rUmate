const _ = require("lodash");
const auth = require("../middleware/auth");
const { Advertisement, validate } = require("../models/advertisement");
const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();


//aggiungi usually checked in html

router.post("/", async (req, res) => {
    query = new mongoose.Query();

    queryRoom = new mongoose.Query();
    Object.entries(req.body.roomFilter).map(filter => {
        queryRoom.or([{ room : filter[1] }]);
    });
    querySex = new mongoose.Query();
    Object.entries(req.body.sexFilter).map(filter => {
        querySex.or([{ flat_sex: filter[1] }]);
    });
    queryResidence = new mongoose.Query();
    Object.entries(req.body.residenceFilter).map(filter => {
        queryResidence.or([{ residence_zone: filter[1] }]);
    });
    query.and([queryRoom.getFilter(),querySex.getFilter(),queryResidence.getFilter()]);

    if(req.body.sort == 'Price'){   query.sort({ price: 'asc'});    }
    if(req.body.sort == 'Expiry_date'){ query.sort({ expiry_date: 'asc'});  }

    const ads = await Advertisement.find(query);

    return res.send(ads);
});

router.get("/:id", async (req, res) => {
    const ad = await Advertisement.findOne({_id: req.params.id});
    if (!ad) return res.status(404).send("Advertisement not found");
    return res.send(ad);
});

router.post("/publishAd", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let ad = await Advertisement.findOne({owner: req.body.owner});
    if (ad) return res.status(400).send("User already has an advertisement");

    advertisement = new Advertisement(_.pick(req.body, ["owner", "title", "description", "prize", "room", "flat_sex", "residence_zone", "expiry_date", "roommate"]));
    await advertisement.save();

    return res.send(advertisement);
});

module.exports = router;