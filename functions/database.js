const mysql = require("mysql");
const config = require("../config.json");

db = mysql.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
});

db.connect(
    function(err) {
        if (err) {
            console.error('DB: Error:' + err.stack);
            return;
        }
        db.query('SELECT 1', function (error) {
        if (error) throw error;
        console.log("DB: Connection succeeded!");
    })
    console.log('DB: Connect ID: ' + db.threadId);
});

module.exports = db;
