const router = require('express').Router();
const authController = require('./authController');

// Registration route
router.route('/register')
	.post(authController.register);

// Login route
router.route('/login')
	.post(authController.login);

module.exports = router;
