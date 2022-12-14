const config = require('../config.json');

function message(key) {
    let lang = require(`../locale/${config.application.language}.json`);
    if(!lang[key]) {
        return "Missing language key: " + key;
    }
    return lang[key];
}

module.exports = {
    message
}