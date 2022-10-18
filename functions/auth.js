const crypto = require('node:crypto');

function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
    return hash === hashVerify;
}

function cryptPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genhash = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
    return {salt:salt, hash:genhash};
}

function isAuth(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = {
    validPassword,
    cryptPassword,
    isAuth
}
