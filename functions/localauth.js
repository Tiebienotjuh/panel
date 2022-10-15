const db = require('./storage');
const crypto = require('node:crypto');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));
	
    passport.use('local-register', new LocalStrategy({usernameField : 'email', passwordField : 'password', passReqToCallback : true}, 
    function(req, email, password, done) {
        db.query("SELECT * `mail` FROM users WHERE mail = ? ", [email.toLowerCase()], function (error, results) {
            if (error) return done(error);
            if (results[0]) {
                return done(null, false);
            } else {
                let salt = crypto.randomBytes(32).toString('hex');
                let hash = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
                db.query("INSERT INTO `users`(`mail`, `hash`, `salt`, `username`) VALUES(?, ?, ?, ?)", [email, hash, salt, password],
                function (error, results) {
                    if (error) return done(error);
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
    }));

    passport.use('local-login', new LocalStrategy({usernameField : 'email',passwordField : 'password',passReqToCallback : true},
    function(req, email, password, done) {
        db.query("SELECT * `mail`, `username`, `hash`, `salt`, `id` FROM users WHERE mail = ? ", [email.toLowerCase()], function (error, results) {
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
		
    }));
};