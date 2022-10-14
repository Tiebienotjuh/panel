const config = require('../config.json');

function message(message) {
    let lang = require(`../locale/${config.application.language}.json`);
    if(!lang[message]) {
        return "Missing language key: " + message;
    }
    return lang[message];
}

module.exports = {
    message
}