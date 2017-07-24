const express = require('express');
const passport = require('passport');
const userRoutes = require('./user/userRoutes');
const authRoutes = require('./auth/authRoutes');

const passportService = require('../config/passport');

module.exports = function(app) {
	// Initializing route groups
	const apiRoutes = express.Router();

	apiRoutes.use('/user', userRoutes);

	app.use('/auth', authRoutes);
	app.use('/api/v1', apiRoutes);
};