/*  
    tools imported for the declaration of RESTful requests 
    auth -> import a function used to check if the user is authenticated
    Notification, validate  -> import a model and a function from the notification module
    mongoose -> connection with MongoDB 
    express -> is a framework for Node.js
    router -> import the RESTful requests 
*/
const _ = require("lodash");
const auth = require("../middleware/auth");
const { Notification, validate } = require("../models/notification");
const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();

// GET request to find notifications related to an user
router.get("/notifications", async (req, res) => {
    const notif = await Notification.findOne({user_id: req.user._id})
    if (!notif) return res.status(404).send("Notification not found");
    return res.send(notif);
});

// POST request to get the notifications from the Database
router.post("/", async (req, res) => {

});

// Export the router requests
module.exports = router;