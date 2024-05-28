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
router.get("/", auth, async (req, res) => {
    const notif = await Notification.findOne({user_id: req.user._id});
    console.log(notif)

    if (!notif) return res.status(404).send("Notification not found");
    return res.send(notif);
});

// POST request to create a new notification and save it on the DataBase
router.post("/", auth, async (req, res) => {
    // validate if the notification is correct, using the validate function
    req.body.user_id = req.user._id;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // load the notification in the Database
    notif = new Notification(req.body);
    await notif.save();
    return res.send(notif);
});

// DELETE request to remove a notification from the DataBase
router.delete("/", async (req, res) => {
    //User.findById("63203694182cd3c22ea480ff").then(doc => { doc.remove();   })
});

// Export the router requests
module.exports = router;