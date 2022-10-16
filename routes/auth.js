const express = require("express")
const passport = require("passport");
const { message } = require("../functions/language.js")
const { authRegister } = require("../functions/auth.js")

const router = express.Router()

router.get("/login", (req, res) => {
    res.render("auth/login", {title: message("login"), m: message})
})

router.get("/register", (req, res) => {
    res.render("auth/register", {title: message("register"), m: message})
})

router.post("/api/signup", (req, res, next) => {
    authRegister(req, res, next)
});

router.post("/api/signin", passport.authenticate("localStrategy", {
      failureRedirect: "/auth?error=incorrect",
      successRedirect: "/auth/succeeded",
    })
);

module.exports = router
