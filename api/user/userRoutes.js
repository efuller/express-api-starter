const router = require('express').Router();
const passport = require('passport');
const userController = require('./userController');
const authController = require('../auth/authController');

// Roles
const ROLE_MEMBER = require('../../config/constants').ROLE_MEMBER;
const ROLE_CLIENT = require('../../config/constants').ROLE_CLIENT;
const ROLE_OWNER = require('../../config/constants').ROLE_OWNER;
const ROLE_ADMIN = require('../../config/constants').ROLE_ADMIN;

// Middleware to require login/auth.
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

// Test protected route.
router.route('/protected')
	.get(requireAuth, (req, res) => {
		res.send({ content: 'The protected test route is functional!'
	});
});

// Test admin only.
router.route('/admins-only')
	.get(requireAuth, authController.roleAuthorization(ROLE_ADMIN), (req, res) => {
		res.send({ content: 'Admin dashboard is working.'
	});
});

// View user profile route.
router.route('/:userId')
	.get(requireAuth, userController.viewProfile);


module.exports = router;