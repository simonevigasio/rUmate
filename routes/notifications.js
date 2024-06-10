const _ = require("lodash");
const auth = require("../middleware/auth");
const { Notification, validate } = require("../models/notification");
const { User } = require("../models/user");
const express = require('express');
const router = express.Router();
const moment = require("moment");

// GET notifications of a specific user
router.get("/", auth, async (req, res) => {

    // get notifications from database and sort them in ascending order
    const notifs = await Notification.find({ reciver_id: req.user._id }).sort({ date: "asc" });

    // send back the result
    return res.send(notifs);
});

// POST a new notification
router.post("/", auth, async (req, res) => {

    // add the sender and date information
    req.body.sender_id = req.user._id;
    req.body.date = moment().format("YYYY MM DD");

    // verify whether the sender is the reciver
    if (req.body.sender_id == req.body.reciver_id) return res.status(400).send("The sender and reciver are the same");

    // verify the validity of the notification
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // verify whether the reciver exists
    const user = await User.findOne({ _id: req.body.reciver_id });
    if (!user) return res.status(400).send("The reciver doesn't exist");

    // create and save the notification
    const notif = new Notification(req.body);
    await notif.save();

    // send back the notification
    return res.send(notif);
});

// DELETE a specific notification
router.delete("/:id", async (req, res) => {

    // find and delete the notififcation with the given id
    const notif = await Notification.findOneAndDelete({ _id: req.params.id });

    // verify whether the notification has been found and deleted
    if (!notif) return res.status(400).send("Notification not found");

    // return the deleted notification
    return res.send(notif);
});

// export api
module.exports = router;