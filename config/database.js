const mysql = require('mysql');
const migration = require('mysql-migrations');

const connection = mysql.createPool({
	connectionLimit : 10,
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'micro_db'
});

migration.init(connection, __dirname + '/../database/migrations');

module.exports = connection;
