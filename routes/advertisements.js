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
const express = require('express');
const router = express.Router();

// GET ads using filters and sorting options
router.get("/", async (req, res) => {

    // get all the ads from the database
    const query = Advertisement.find();

    // apply filters if selected
    if (req.query.roomFilter) query.in("room", JSON.parse(req.query.roomFilter));
    if (req.query.sexFilter) query.in("flat_sex", JSON.parse(req.query.sexFilter));
    if (req.query.residenceFilter) query.in("residence_zone", JSON.parse(req.query.residenceFilter));

    // sort the ads filtered
    const sort = req.query.sort;
    if (sort == "Price") query.sort({ price: "asc" });
    else if (sort == "Expiry_date") query.sort({ expiry_date: "asc" });

    // execute the command 
    const ads = await query.exec();
    return res.send(ads);
});

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