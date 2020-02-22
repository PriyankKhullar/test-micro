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
				id:'id',
				username:'name',
				email:'email',
				token:'token'
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
						transformData = sendJsonResponse(user[0]);
						res.status(201).json({
							'data': transformData,
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
				let user = results[0];
				if(bcrypt.compareSync(userData.password, user.password)) {
					let token = jwt.sign({ user: user }, 'secret', { expiresIn: '1h' });

					user.token = 'Bearer ' + token;
					transformData = sendJsonResponse(user);

					res.status(200).json({
						'data': transformData
					});
				} else {
					res.status(401).json({
						'errors': {message: 'Authentication Fails!'}
					});
				}
			}
		});
	},

	profile: (req, res) => {
		let token = req.headers.authorization;
		if(!token) {
			res.status(401).json({'error': 'Authenticate error!'});

		} else {

			let $token = token.replace("Bearer ","");
			let decoded = jwt.verify($token, 'secret');

			transformData = sendJsonResponse(decoded.user);
			res.status(200).json({
				'data': transformData
			});
		}
	},

	editProfile: (req, res) => {
		let token = req.headers.authorization;
		if(!token) {
			res.status(401).json({'error': 'Authenticate error!'});

		} else {

			let $token = token.replace("Bearer ","");
			let decoded = jwt.verify($token, 'secret');

			const userData = {
				name: req.body.name,
				email: req.body.email,
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
					db.query(user.updateUser(decoded.user.id), (err, result) => {
						if (err) {
							res.status(400).json({'error': err.message})
						};

						res.status(200).json({
							'message': 'User updated successfully!'
						});
					});
				}
			});
		}
	}
};
