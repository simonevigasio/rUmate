require("dotenv").config();

const cors = require("cors");
const path = require('path');
const express = require('express');
const auth = require("./routes/authenticate");
const advertisements = require("./routes/advertisements");
const users = require("./routes/users");
const preferences = require("./routes/preferences");
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
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use("/authenticate", auth);
app.use("/users", users);
app.use("/advertisements", advertisements);
app.use("/preferences", preferences);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public", "home.html"));
});

app.listen(3000, () => {
    console.log(`Server listening on port ${3000}...`);
});