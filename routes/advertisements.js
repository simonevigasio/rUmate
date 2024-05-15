/*  
    tools imported for the declaration of RESTful requests 
    auth -> import a function used to check if the user is authenticated
    Advertisement, validate  -> import a model and a function from the advertisement module
    mongoose -> connection with MongoDB 
    express -> is a framework for Node.js
    router -> import the RESTful requests 

    */
const _ = require("lodash");
const auth = require("../middleware/authorize");
const { Advertisement, validate } = require("../models/advertisement");
const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();

// POST request to get the advertisements from the Database
router.post("/", async (req, res) => {
    // This query permit to get only the advertisement wanted by the user, filtered by the parameter in the body of the request
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

    // This part of the query permit to sort the ads
    if(req.body.sort == 'Price'){   query.sort({ price: 'asc'});    }
    if(req.body.sort == 'Expiry_date'){ query.sort({ expiry_date: 'asc'});  }

    // save in ads all the adveritsement find in the Database which respect the query criteria 
    const ads = await Advertisement.find(query);

    return res.send(ads);
});

// GET request to find a specific advertisement knowing its ID
router.get("/:id", async (req, res) => {
    const ad = await Advertisement.findOne({_id: req.params.id});
    if (!ad) return res.status(404).send("Advertisement not found");
    return res.send(ad);
});

// POST request to add an advertisement in the database
router.post("/publish", auth, async (req, res) => {
    // validate if the advertisement is correct, using the validate function
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if exist another advertisement in the Database with the same owner
    let ad = await Advertisement.findOne({owner: req.body.owner});
    if (ad) return res.status(400).send("User already has an advertisement");

    // load the advertisement in the Database
    advertisement = new Advertisement(_.pick(req.body, ["owner", "title", "description", "prize", "room", "flat_sex", "residence_zone", "expiry_date", "roommate"]));
    await advertisement.save();

    return res.send(advertisement);
});

// Export the router requests
module.exports = router;