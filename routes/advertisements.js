/*  
    tools imported for the declaration of RESTful requests 
    auth -> import a function used to check if the user is authenticated
    Advertisement, validate  -> import a model and a function from the advertisement module
    mongoose -> connection with MongoDB 
    express -> is a framework for Node.js
    router -> import the RESTful requests 

*/
const _ = require("lodash");
const auth = require("../middleware/auth");
const { Advertisement, validate } = require("../models/advertisement");
const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();


// POST request to get all the advertisements from the Database that respect the parameters
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

    // this part of the query permits to sort the ads
    if(req.body.sort == 'Price'){   query.sort({ price: 'asc'});    }
    if(req.body.sort == 'Expiry_date'){ query.sort({ expiry_date: 'asc'});  }

    // save in ads all the advertisements found in the Database which respect the query criteria 
    const ads = await Advertisement.find(query);

    return res.send(ads);
});

/*
// GET request to get all the advertisements from the Database that respect the parameters
router.get("/", async (req, res) => {
    query = new mongoose.Query();

    queryRoom = new mongoose.Query();
    Object.entries(req.query.roomFilter).map(filter => {
        queryRoom.or([{ room : filter[1] }]);
    });
    querySex = new mongoose.Query();
    Object.entries(req.query.sexFilter).map(filter => {
        querySex.or([{ flat_sex: filter[1] }]);
    });
    queryResidence = new mongoose.Query();
    Object.entries(req.query.residenceFilter).map(filter => {
        queryResidence.or([{ residence_zone: filter[1] }]);
    });
    query.and([queryRoom.getFilter(),querySex.getFilter(),queryResidence.getFilter()]);

    // this part of the query permits to sort the ads
    if(req.query.sort == 'Price'){   query.sort({ price: 'asc'});    }
    if(req.query.sort == 'Expiry_date'){ query.sort({ expiry_date: 'asc'});  }

    // save in ads all the advertisements found in the Database which respect the query criteria 
    const ads = await Advertisement.find(query);

    return res.send(ads);
});*/

// GET request to find a specific advertisement knowing its ID
router.get("/getById/:id", async (req, res) => {
    const ad = await Advertisement.findOne({_id: req.params.id});
    if (!ad) return res.status(404).send("Advertisement not found");
    return res.send(ad);
});

// GET request to find a specific advertisement knowing its owner's id
router.get("/getByUser/:userId", async (req, res) => {
    const ad = await Advertisement.findOne({user_id: req.params.userId});
    if (!ad) return res.status(404).send("Advertisement not found");
    return res.send(ad);
});

// POST request to add an advertisement in the database
router.post("/publish", auth, async (req, res) => {
    // validate if the advertisement is correct, using the validate function
    req.body.user_id = req.user._id;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if exist another advertisement in the Database with the same owner
    let ad = await Advertisement.findOne({user_id: req.body.user_id});
    if (ad) return res.status(400).send({message: "User already has an advertisement published"});

    // load the advertisement in the Database
    ad = new Advertisement(req.body);
    await ad.save();

    return res.send(ad);
});

// DELETE request to delete a specific advertisement from the database knowing its owner's ID
router.delete("/delete/:id", async (req, res) => {
    // find the advertisement by its owner's ID and delete it
    const ad = await Advertisement.findOneAndDelete({user_id: req.params.id});
    if (!ad) {
        return res.status(404).send("Advertisement not found");
    }
    return res.send("Advertisement deleted successfully");
});

// Export the router requests
module.exports = router;