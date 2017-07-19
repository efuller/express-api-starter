const app = require('./server');

// Engage!
app.set('port', process.env.PORT || 3001);
const server = app.listen(app.get('port'), () => {
	console.log(`Express is running on port ${server.address().port}`);
});