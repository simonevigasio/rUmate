require("dotenv").config();
require("./config/passport-setup");

const cors = require("cors");
const path = require('path');
const express = require('express');
const auth = require("./routes/authenticate");
const advertisements = require("./routes/advertisements");
const passport = require("passport");
const cookieSession = require('cookie-session')
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

app.use(cookieSession({
    name: "session",
    keys: [process.env.COOKIE_SESSION_KEY],
    maxAge: 5 * 60 * 60 * 1000
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", auth);
app.use("/advertisements", advertisements);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public", "home.html"));
});

app.listen(3000, () => {
    console.log(`Server listening on port ${3000}...`);
});