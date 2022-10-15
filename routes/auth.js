const express = require("express")
const fs = require("fs");
const { message } = require("../functions/language.js")

const router = express.Router()

router.get("/login", (req, res) => {
    res.render("auth/login", {title: message("login"), m: message})
})

router.get("/test", (req, res) => {
    fs.readFile('./config.json', (e, data) => {
        if (e) throw e;
        res.render("dashboard/edit", {title: message("login"), m: message, data: data})
    });
})

router.get("/register", (req, res) => {
    res.render("auth/register", {title: message("register"), m: message})
})

module.exports = router
