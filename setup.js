const express = require("express")
const mysql = require("mysql");
const fs = require("fs");
const db = require("../functions/database.js");

fs.exists("./config.json", (exists) => {
    if (!exists) {
        console.log("Config file not found! Please create a config.json file in the root directory of the panel.");
        process.exit(1);
    }
});

const config = require("./config.json");
if(!config.database) {
    console.log("Config file is missing the database section. Please add it.");
    process.exit(1);
}
if(!config.database.host && !config.database.port && !config.database.user && !config.database.password && !config.database.database) {
    console.log("Config file database section is setupped incorrectly. Please add the host, port, user, password, and database fields.");
    process.exit(1);
}

db.query("SELECT * FROM `users`", (err, result) => {
var app = express();

app.listen(config.webserver.port, () => {
    console.log("SETUP: Server started!");
});
