const debug = require("debug")("app:setting");
const morgan = require("morgan");
const helmet = require("helmet");
const Joi = require("joi");
const path = require('path');
const express = require('express');
const gestione_utente = require("./routes/gestione_utente");
const home = require("./routes/home");
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