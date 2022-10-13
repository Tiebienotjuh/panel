const express = require("express");
const { message } = require("../functions/language.js")

const router = express.Router();

router.get("/login", (req, res) => {
    res.render("auth/login", {title: "Login"})
})

module.exports = router;
