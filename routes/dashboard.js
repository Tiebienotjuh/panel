const express = require("express")
const mysql = require("mysql")
const config = require("../config.json")
const db = require("../functions/database.js");
const { message } = require("../functions/language.js")
const { isAuth } = require("../functions/auth.js");

const router = express.Router()

router.get("/", isAuth, (req, res) => {
    res.redirect('/dashboard')
});

router.get("/dashboard", isAuth, (req, res) => {
    res.render("dashboard/dashboard", {title: "Dashboard", m: message, pannelname: config.application.name})
});

router.get("/dashboard", isAuth, (req, res) => {
    let sql = mysql.format("SELECT * FROM servers WHERE user_id = ?", [req.session.userid]);
    db.query(sql, function (err, data) {
        if (err) throw err;
        res.render("dashboard/dashboard", {title: "Dashboard", m: message, panelname: config.application.name, servers: data})
    });
});

module.exports = router
