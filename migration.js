const connection = require('./config/database.js');

function executeQuery(sql, callback) {
	connection.getConnection((err, connection) => {
		if (err) {
			return callback(err, null);
		} else {
			if (connection) {
				connection.query(sql, function (error, results, fields) {
					connection.release();
					if (error) {
						return callback(error, null);
					}
					return callback(null, results);
				});
			}
		}
	});
}

function query(sql, callback) {
	executeQuery(sql, function (err, data) {
		if (err) {
			return callback(err);
		}
		callback(null, data);
	});
}

module.exports = {
	query: query,
	connection: connection
}