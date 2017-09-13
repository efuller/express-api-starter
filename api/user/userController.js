const User = require('./userModel');

// User Routes
exports.viewProfile = function (req, res, next) {
	const userId = req.params.userId;

	if (req.user.id.toString() !== userId) { return res.status(401).json({ error: 'You are not authorized to view this user profile.' }); }
	User.findById(userId, (err, user) => {
		if (err) {
			res.status(400).json({ error: 'No user could be found for this ID.' });
			return next(err);
		}

		const userToReturn = user.toAuthJSON();

		return res.status(200).json({ user: userToReturn });
	});
};

exports.me = function(req, res, next) {
	const user = req.user;
	User.findById(user.id, (err, user) => {
		if (err) {
			res.status(400).json({ error: 'No user could be found for this ID.' });
			return next(err);
		}

		const userToReturn = user.toAuthJSON();

		return res.status(200).json({ user: userToReturn });
	});
};
