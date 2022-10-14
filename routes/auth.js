const express = require("express")
const session = require("express-session")
const { message } = require("../functions/language.js")

const router = express.Router()

router.get("/login", (req, res) => {
    res.render("auth/login", {title: "Login", session: session})
})

router.get("/register", (req, res) => {
    res.render("auth/register", {title: "Register", session: session})
})

module.exports = router
