const express = require("express")
const { message } = require("../functions/language.js")
const { isAuth } = require("../functions/auth.js");
const config = require("../config.json")

const router = express.Router()

router.get("/dashboard", isAuth, (req, res) => {
    res.render("dashboard/dashboard", {title: "Dashboard", m: message, app: config.application})
})

module.exports = router
