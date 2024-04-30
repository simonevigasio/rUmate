require('dotenv').config();

const debug = require("debug")("app:setting");
const morgan = require("morgan");
const helmet = require("helmet");
const Joi = require("joi");
const path = require('path');
const express = require('express');
const gestione_utente = require("./routes/gestione_utente");
const home = require("./routes/home");
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;

// connessione mongodb
mongoose.connect(mongoString);

// stato della connessione
const database = mongoose.connection;

// in caso di errore visualizzato sul prompt
database.on('error', (error) => {
    console.log(error)
});

// in caso la connessione è avvenuta con successo segnalalo sul prompt
database.once('connected', () => {
    console.log('Database Connected');
});

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use("/", home);
app.use("/gestione_utente", gestione_utente);

if (app.get("env") == "development") {
    app.use(morgan("tiny"));
    debug("Morgan attivato");
}

app.listen(3000, () => {
    console.log(`Il server sta ascoltando sulla porta ${3000}...`);
});