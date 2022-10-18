const express = require("express")
const config = require("../config.json")
const db = require("../functions/database.js");
const { message } = require("../functions/language.js")
const { isAuth } = require("../functions/auth.js");

const router = express.Router()

router.get("/", isAuth, (req, res) => {
    res.redirect('/dashboard')
});

router.get("/dashboard", isAuth, (req, res) => {
    res.render("dashboard/dashboard", {title: "Dashboard", m: message, app: config.application, flash: req.flash()})
});

router.get("/dashboard", isAuth, (req, res) => {
    db.query("SELECT * FROM servers WHERE ownerid = ?", [req.user.id], function (err, data) {
        if (err) throw err;
        res.render("dashboard/dashboard", {title: "Dashboard", m: message, app: config.application, servers: data})
    });
});

module.exports = router
