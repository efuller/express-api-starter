const express = require('express');

// The app.
const app = express();

// Setup a generic route.
app.use('/', (req, res) => {
	res.json('Here is the API Server!');
});

module.exports = app;