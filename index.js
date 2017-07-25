const mongoose = require('mongoose');
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
	// Environment Variables
	dotenv.config();
}

// Database connection.
mongoose.connect(process.env.DATABASE, { useMongoClient: true });
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
	console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

const app = require('./server');

// Engage!
app.set('port', process.env.PORT || 3001);
const server = app.listen(app.get('port'), () => {
	console.log(`Express is running on port ${server.address().port}`);
});
