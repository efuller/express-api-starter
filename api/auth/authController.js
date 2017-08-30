const jwt = require('jsonwebtoken');
const User = require('../user/userModel');
const getRole = require('../user/helpers').getRole;

// Login
exports.login = function (req, res, next) {
	if (req.body.email && req.body.password) {
		var userEmail = req.body.email;
		var password = req.body.password;
	}

	User.findOne({ email: userEmail })
		.then(function(user) {
			if (!user) {
				res.status(401).json({ message: 'No such user found' });
				return next();
			}

			user.comparePassword(password, function(err, isMatch) {
				if (err) { next(err); }
				if (!isMatch) {
					res.status(401).json({ message: 'Passwords did not match.' });
				} else {
					console.log(res.user);
					res.json({ message: 'ok', user: user.toAuthJSON() });
				}
			});
		}).catch(next);
};


// Registration
exports.register = function (req, res, next) {
	// Check for registration errors
	const email = req.body.email;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const password = req.body.password;

	// Return error if no email provided
	if (!email) {
		return res.status(422).send({ error: 'You must enter an email address.' });
	}

	// Return error if full name not provided
	if (!firstName || !lastName) {
		return res.status(422).send({ error: 'You must enter your full name.' });
	}

	// Return error if no password provided
	if (!password) {
		return res.status(422).send({ error: 'You must enter a password.' });
	}

	User.findOne({ email }, (err, existingUser) => {
		if (err) { return next(err); }

		// If user is not unique, return error
		if (existingUser) {
			return res.status(422).send({ error: 'That email address is already in use.' });
		}

		// If email is unique and password was provided, create account
		const user = new User({
			email,
			password,
			profile: { firstName, lastName }
		});

		user.save()
			.then(function() {
				res.json({ user: user.toAuthJSON() });
			})
			.catch(next);
	});
};

// Role authorization check
exports.roleAuthorization = function (requiredRole) {
	return function (req, res, next) {
		const user = req.user;

		User.findById(user.id, (err, foundUser) => {
			if (err) {
				res.status(422).json({ error: 'No user was found.' });
				return next(err);
			}

			// If user is found, check role.
			if (getRole(foundUser.role) >= getRole(requiredRole)) {
				return next();
			}

			return res.status(401).json({ error: 'You are not authorized to view this content.' });
		});
	};
};
