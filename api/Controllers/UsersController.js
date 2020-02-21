const User = require('../../models/User');
const db = require('./../../migration');
const bcrypt = require('bcrypt');
const nodeJsonTransformer = require('json-transformer-node');

function sendJsonResponse(data)
{
	const transformation = {
	    mapping : {
	        item : {
	        	Id: 'id',
	            Username : 'name',
	            EmailAddress :'email'
	        }
	    }
	}

	const output = nodeJsonTransformer.transform(data[0], transformation);
	return output;
}

module.exports = {
	signup: (req, res) => {
		const salt = bcrypt.genSaltSync(10);
		const hashPassword = bcrypt.hashSync(req.body.password, salt);

		const userData = {
			name: req.body.name,
			email: req.body.email,
			password: hashPassword
		}

		const user = new User(userData);
		db.query(User.getUserByEmail(userData.email), (err, data) => {
			if (err) {
				res.status(400).json({'error': err.message});
			};

			if(data.length >= 1) {
				res.status(200).json({
					'message': 'User already exist with this email id.',
				});

			} else {
				db.query(user.addUser(), (err, result) => {
					if (err) {
						res.status(400).json({'error': err.message})
					};

					db.query(User.getUserById(result.insertId), (err, user) => {
						transformData = sendJsonResponse(user);
						res.status(200).json({
							'data': transformData
						});
					});
				});
			}
		});
	},

	login: (req, res) => {
		console.log(req.body);
	}
};
