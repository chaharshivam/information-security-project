var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "localhost",
    port: 3306,
  user: "root",
  password: "root",
  database: 'sqlinjection_db',
});

module.exports = connection;

