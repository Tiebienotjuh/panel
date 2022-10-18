const express = require("express")
const passport = require("passport");
const Local = require("passport-local").Strategy;

const db = require("../functions/database.js");
const { message } = require("../functions/language.js")
const { cryptPassword, validPassword } = require("../functions/auth.js");

const router = express.Router()

// load frontand page
router.get("/login", (req, res) => {
  if(req.query.error) req.flash("red", message("invalidCredentials"));
	res.render("auth/login", {
    title: message("login"),
		m: message,
		flash: req.flash()
	})
})

router.get("/register", (req, res) => {
	res.render("auth/register", {
		title: message("register"),
		m: message,
		flash: req.flash()
	})
})

//passport local authentication
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));


let localCallback = (username, password, done) => {
	db.query("SELECT `mail`, `username`, `hash`, `salt`, `id` FROM `users` WHERE mail = ? or username = ?", [username.toLowerCase(), username], function(error, results) {
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
	});
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
}));

router.post("/api/signup", (req, res, next) => {
	db.query("SELECT * FROM `users` where mail = ?", [req.body.mail.toLowerCase()], function(error, results) {
		if (error) return res.status(500).send({error: error});
    console.log(results);
		if (results[0]) {
      req.flash("red", message("mailAlreadyExists"));
      return res.redirect('/register');
    }
    let passwd = cryptPassword(req.body.password);
    db.query("INSERT INTO `users`(`mail`, `hash`, `salt`, `username`) VALUES(?, ?, ?, ?)", [req.body.mail.toLowerCase(), passwd.hash, passwd.salt, req.body.username, ], function(error, results) {
      if (error) return res.status(500).send({error: error});
      req.flash("green", message("registerSuccess"));
      res.redirect('/login');
    });
	});
});

module.exports = router