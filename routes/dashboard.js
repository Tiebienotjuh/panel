const express = require("express")
const { message } = require("../functions/language.js")
const { loggedin } = require("../functions/loggedin");
const config = require("../config.json")

const router = express.Router()

router.get("/dashboard", (req, res) => {
    loggedin(req, res, () => {
        res.render("dashboard/dashboard", {title: "Dashboard", m: message, pannelname: config.application.name})
    })
})

module.exports = router
