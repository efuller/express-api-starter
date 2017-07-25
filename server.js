const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./api/api');

// The app.
const app = express();

// Setting up basic middleware for all Express requests
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(cors());

// Setup a generic route.
router(app);

module.exports = app;
