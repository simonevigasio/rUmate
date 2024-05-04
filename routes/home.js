const { Advertisement, validate } = require("../models/advertisement");
const mongoose = require("mongoose");
const express = require('express');
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "home.html"));
});

module.exports = router;