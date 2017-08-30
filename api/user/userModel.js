// Importing Node packages required for schema
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const ROLE_MEMBER = require('../../config/constants').ROLE_MEMBER;
const ROLE_CLIENT = require('../../config/constants').ROLE_CLIENT;
const ROLE_OWNER = require('../../config/constants').ROLE_OWNER;
const ROLE_ADMIN = require('../../config/constants').ROLE_ADMIN;

const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema({
	email: {
		type: String,
		lowercase: true,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	profile: {
		firstName: { type: String },
		lastName: { type: String }
	},
	role: {
		type: String,
		enum: [ROLE_MEMBER, ROLE_CLIENT, ROLE_OWNER, ROLE_ADMIN],
		default: ROLE_MEMBER
	},
	resetPasswordToken: { type: String },
	resetPasswordExpires: { type: Date }
},
{
	timestamps: true
});

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function(next) {
	const user = this;
	const SALT_FACTOR = 5;

	if (!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, null, (err, hash) => {
			if (err) return next(err);

			user.password = hash;
			next();
		});
	});
});

// Method to compare password for login
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
		if (!err) {
			return cb(null, isMatch);
		}
		return cb(err);
	});
};

UserSchema.methods.generateJWT = function generateJWT() {
	const today = new Date();
	const exp = new Date(today);
	exp.setDate(today.getDate() + 60);

	return jwt.sign({
		id: this._id,
		email: this.email,
		exp: parseInt(exp.getTime() / 100, 10)
	}, process.env.SECRET);
};

UserSchema.methods.toAuthJSON = function toAuthJSON() {
	return {
		id: this._id,
		email: this.email,
		token: this.generateJWT(),
		role: this.role
	};
};

module.exports = mongoose.model('User', UserSchema);
