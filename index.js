require("dotenv").config();

const cors = require("cors");
const path = require('path');
const express = require('express');
const auth = require("./routes/authenticate");
const advertisement = require("./routes/advertisements");
const {google} = require('googleapis');
const mongoose = require('mongoose');

const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);

const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
});

database.once('connected', () => {
    console.log('Database connected');
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use("/auth", auth);
app.use("/advertisements", advertisement);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public", "home.html"));
});

app.listen(3000, () => {
    console.log(`Server listening on port ${3000}...`);
});