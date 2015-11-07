var express = require('express');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


module.exports = function(){
	var app = express();

	console.log("dev");

	
	app.use(morgan('dev'));

	app.use(bodyParser.urlencoded({
		extended : true
	}));



	app.use(bodyParser.json());

	app.use(methodOverride());

	require('../../app/routes/index.server.routes.js')(app);
	
	return app;
};