const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../user/userModel');
const setUserInfo = require('../user/helpers').setUserInfo;
const getRole = require('../user/helpers').getRole;

// Generate JWT
function generateToken(user) {
	return jwt.sign(user, process.env.SECRET, {
		expiresIn: 604800 // in seconds
	});
}

// Login
exports.login = function (req, res, next) {
	const userInfo = setUserInfo(req.user);

	res.status(200).json({
		token: `JWT ${generateToken(userInfo)}`,
		user: userInfo
	});
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

		user.save((err, user) => {
			if (err) { return next(err); }

			// Respond with JWT if user was created
			const userInfo = setUserInfo(user);

			res.status(201).json({
				token: `JWT ${generateToken(userInfo)}`,
				user: userInfo
			});
		});
	});
};

// Role authorization check
exports.roleAuthorization = function (requiredRole) {
	return function (req, res, next) {
		const user = req.user;

		User.findById(user._id, (err, foundUser) => {
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
