const express = require("express")
const mysql = require("mysql")
const { message } = require("../functions/language.js")
const { loggedin } = require("../functions/loggedin.js");
const config = require("../config.json")
const db = require("../functions/database.js")

const router = express.Router()

router.get("/dashboard", (req, res) => {
    req.session.loggedin = true
    req.session.userid = 1
    loggedin(req, res, () => {
        let sql = mysql.format("SELECT * FROM servers WHERE id = ?", [req.session.userid]);
        db.query(sql, function (err, data) {
            if (err) throw err;
            res.render("dashboard/dashboard", {title: "Dashboard", m: message, panelname: config.application.name, servers: data})
        });
    })
})

module.exports = router
