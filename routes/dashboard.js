const express = require("express")
const session - require("express-session")
const { message } = require("../functions/language.js")

const router = express.Router()

router.get("/dashboard", (res, req) => {
    if (session.loggedin) {
        res.render("dasboard/dasboard", {title: "Dashboard", session: session})
    } else {
        res.redirect("/login")
    }
})

module.exports = router
