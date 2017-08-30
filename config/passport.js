// Importing Passport, strategies, and config
const passport = require('passport');
const User = require('../api/user/userModel');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Setting JWT strategy options
const jwtOptions = {
	// Telling Passport to check authorization headers for JWT
	jwtFromRequest: ExtractJwt.fromAuthHeader(),
	// Telling Passport where to find the secret
	secretOrKey: process.env.SECRET
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
	User.findById(payload.id)
		.then((user) => {
			if (!user) {
				done(null, false);
			}
			done(null, user.toAuthJSON());
		}).catch(done);
});

passport.use(jwtLogin);
