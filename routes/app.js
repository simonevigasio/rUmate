require("dotenv").config();

const cors = require("cors");
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const auth = require("./authenticate");
const advertisements = require("./advertisements");
const users = require("./users");
const chats = require("./chats");
const preferences = require("./preferences");

const app = express();

const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);

const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error);
});

database.once('connected', () => {
    console.log('Database connected');
});

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors({
    exposedHeaders: ['X-Auth-Token'] 
}));

app.use("/authenticate", auth);
app.use("/users", users);
app.use("/advertisements", advertisements);
app.use("/preferences", preferences);
app.use("/chats", chats);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

module.exports = app;