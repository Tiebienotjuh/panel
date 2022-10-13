const config = require('../config.json');

function message(message) {
    let lang = require(`../locale/${config.application.language}.json`);
    return lang[message];
}

module.exports = {
    message
}