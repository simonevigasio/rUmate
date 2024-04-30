const express = require('express');
const path = require("path")
const router = express.Router();

router.get("/", (res, req) => {
    res.send("gestione utente");
});

module.exports = router;