const express = require("express");
const session = require("express-session")
const fs = require("fs");
const config = require("./config.json")
const { message } = require("./functions/language.js")
const { db } = require("./functions/database.js")
const { loggedin } = require("./functions/loggedin");

var app = express();

app.use(session({
    key: config.webserver.session.key,
    secret: config.webserver.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: config.webserver.session.maxAge,
    }
}));

app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");

fs.readdirSync('./routes/').filter((file) => file.endsWith('.js')).forEach((route) => {
    app.use(require(`./routes/${route}`));
})

app.get("/", (req, res) => {
    loggedin(req, res, () => {
        res.redirect("/dashboard")
    })
})

app.listen(config.webserver.port, () => {
    console.log(message("start"), `${config.webserver.ssl.enabled ? 'https://' : 'http://'}${config.webserver.host}:${config.webserver.port}`);
});
