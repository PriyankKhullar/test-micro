const User = require('../../models/User');
const db = require('./../../migration');
const bcrypt = require('bcrypt');
const nodeJsonTransformer = require('json-transformer-node');
const jwt = require('jsonwebtoken');

function sendJsonResponse(data)
{
	const transformation = {
		mapping : {
			item : {
				Id:'id',
				Username:'name',
				EmailAddress:'email',
				Token:'token'
			}
		}
	}

	const output = nodeJsonTransformer.transform(data, transformation);
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
						res.status(201).json({
							'message': 'User Created Successfully!'
						});
					});
				});
			}
		});
	},

	login: (req, res) => {
		const userData = {
			email: req.body.email,
			password: req.body.password
		}

		db.query(User.getUserByEmail(userData.email), (err, results) => {
			if (err) {
				res.status(400).json({'error': err.message});
			};

			if(results.length <= 0) {
				res.status(401).json({
					'errors': {
						message: 'User does not exist!',
					}
				});

			} else {
				var user = results[0];
				if(bcrypt.compareSync(userData.password, user.password)) {
					var token = jwt.sign({ user: user }, 'secret', { expiresIn: '1h' });

					user.token = 'Bearer ' + token;
					transformData = sendJsonResponse(user);

					res.status(200).json({
						'data': transformData
					});
				} else {
					res.status(401).json({
						'errors': {
							message: 'Authentication Fails!',
						}
					});
				}
			}
		});
	}
};
