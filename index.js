const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const db = require("./functions/database.js");
const fs = require("fs");

const config = require("./config.json")
const { message } = require("./functions/language.js")
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");

fs.readdirSync('./routes/').filter((file) => file.endsWith('.js')).forEach((route) => {
    app.use(require(`./routes/${route}`));
})

app.get("*", (req, res) => {
    res.render("general/404", {title: message("404"), m: message})
});

fs.exists("./database", (exists) => {
    if (!exists) {
        let sql = [
            "CREATE TABLE `users`(`id` INT NOT NULL AUTO_INCREMENT, `admin` INT NULL, `username` VARCHAR(255) NOT NULL, `mail` VARCHAR(255) NOT NULL, `hash` VARCHAR(255) NOT NULL, `salt` VARCHAR(255) NOT NULL, PRIMARY KEY (`id`));",
            "CREATE TABLE `servers`(`id` INT NOT NULL AUTO_INCREMENT, `name` VARCHAR(255) NOT NULL, `location` INT NOT NULL, `network` VARCHAR(255) NOT NULL, `max_ram` INT NOT NULL, `max_disk` INT NOT NULL, `image_id` INT NOT NULL, `startcmd` TEXT NOT NULL, `users` JSON NOT NULL, `ownerid` INT NOT NULL, `suspended` TINYINT(1) NULL, PRIMARY KEY (`id`));",
            "CREATE TABLE `locations`(`id` INT NOT NULL AUTO_INCREMENT, `name` VARCHAR(255) NOT NULL, `token` TEXT NOT NULL, `max_ram` INT NOT NULL, `max_disk` INT NOT NULL, `locked` INT NULL, `network` JSON NOT NULL, PRIMARY KEY (`id`));",
            "CREATE TABLE `images`(`id` INT NOT NULL AUTO_INCREMENT, `name` VARCHAR(255) NOT NULL, `docker_images` VARCHAR(255) NOT NULL, `start_command` TEXT NOT NULL, PRIMARY KEY (`id`));"
        ]

        for (let i = 0; i < sql.length; i++) {
            db.query(sql[i], (err, result) => {
                if (err) throw err;
                console.log(result);
            });
        };
    } else {
        console.log("Database already exists");
    }
});

app.listen(config.webserver.port, () => {
    console.log(message("start"), `${config.webserver.ssl.enabled ? 'https://' : 'http://'}${config.webserver.host}:${config.webserver.port}`);
});
