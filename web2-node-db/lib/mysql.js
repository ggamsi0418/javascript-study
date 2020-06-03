var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '01032645255',
    database: 'opentutorials'
});

module.exports = connection