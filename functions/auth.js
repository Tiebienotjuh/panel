const db = require('./database');
const crypto = require('node:crypto');
const passport = require("passport");
const Local = require('passport-local').Strategy;

let customFields = {
    usernameField: "mail",
    passwordField: "password",
  };
  
let authCallback = (username, password, done) => {
     db.query("SELECT * `mail`, `username`, `hash`, `salt`, `id` FROM users WHERE mail = ? ", [username], function (error, results) {
        if (error) return done(error);
		if(!results[0]) return done(null, false);

        let hash = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
        if(!hash == password) return done(null, false);

        user = {
            id: results[0].id,
            username: results[0].username,
            mail: results[0].mail
        }
        return done(null, user);
	});
};

function authRegister(email, password) {
    db.query("SELECT * `mail` FROM users WHERE mail = ? ", [email], function (error, results) {
        if (error) return done(error);
        if (results[0]) {
            return done(null, false);
        } else {
            let salt = crypto.randomBytes(32).toString('hex');
            let hash = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
            db.query("INSERT INTO `users`(`mail`, `hash`, `salt`, `username`) VALUES(?, ?, ?, ?)", [email, hash, salt, password],
            function (error, results) {
                if (error) return(error);
                return done(null, results[0]);
            });
            user = {
                id: results[0].id,
                mail: email,
                password: results[0].mail
            }
            return done(null, user);
        }	
    });
};

function isAuth(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
};

const localStrategy = new Local(customFields, authCallback);
passport.use(localStrategy);

module.exports = {
    authRegister,
    isAuth
};