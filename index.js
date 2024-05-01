require('dotenv').config();

const debug = require("debug")("app:setting");
const helmet = require("helmet");
const Joi = require("joi");
const path = require('path');
const express = require('express');
const login = require("./routes/login");
const users = require("./routes/users");
const home = require("./routes/home");
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
app.use(helmet());
app.use("/", home);
app.use("/users", users);
app.use("/login", login);

app.listen(3000, () => {
    console.log(`Server listening on port ${3000}...`);
});