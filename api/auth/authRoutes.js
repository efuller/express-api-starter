const router = require('express').Router();
const passport = require('passport');
const authController = require('./authController');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

// Registration route
router.route('/register')
	.post(authController.register);

// Login route
router.route('/login')
	.post(requireLogin, authController.login);

module.exports = router;