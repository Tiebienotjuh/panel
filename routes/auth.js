const express = require("express")
const passport = require("passport");
const Local = require("passport-local").Strategy;

const db = require("../functions/database.js");
const { message } = require("../functions/language.js")
const { cryptPassword, validPassword } = require("../functions/auth.js");

const router = express.Router()

// load frontand page
router.get("/login", (req, res) => {
    res.render("auth/login", {title: message("login"), m: message})
})

router.get("/register", (req, res) => {
    res.render("auth/register", {title: message("register"), m: message})
})

//passport local authentication
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));


let localCallback = (username, password, done) => {
    db.query("SELECT `mail`, `username`, `hash`, `salt`, `id` FROM `users` WHERE mail = ? ",[username.toLowerCase()], function (error, results) {
        if (error) return done(error);
        if (results[0]) {
          let isValid = validPassword(password, results[0].hash, results[0].salt);
          if (isValid) {
            user = {
              id: results[0].id,
              username: results[0].username,
              mail: results[0].mail
            };
            return done(null, user);
          }
          return done(null, false);
        }
        return done(null, false);
      }
    );
  };
  
let customFields = {
    usernameField: "mail",
    passwordField: "password",
};

const local = new Local(customFields, localCallback);
passport.use(local);

router.post("/api/signin", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login?error=true",
  })
);

router.post("/api/signup", (req, res, next) => {
    db.query("SELECT * FROM `users` where mail = ?", [req.body.mail], function (error, results) {
        if (error) return res.status(500).send({error: error});
        if (results[0]) return res.status(500).send({error: "Mail already in use"});
    });
    let passwd = cryptPassword(req.body.password);
    db.query("INSERT INTO `users`(`mail`, `hash`, `salt`, `username`) VALUES(?, ?, ?, ?)", [req.body.email.toLowerCase(), passwd.hash, passwd.salt, req.body.username,], function (error, results) {
        if (error) return res.status(500).send({error: error});
        res.status(200).send({success: "User created", results: results});
    }
    );
  });

module.exports = router
