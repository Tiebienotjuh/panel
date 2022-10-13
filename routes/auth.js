const express = require("express");
const { message } = require("../functions/language.js")

const router = express.Router();

router.use('*', (req, res) => {
   res.send(message("404"));
});

module.exports = router;