module.exports = require('./env/'+process.env.NODE_ENV + '.js');



/*var express = require('express');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


module.exports = function(){
	var app = express();

	console.log("dev");

	//개발 환경에서는 log를 남기고 상용 환경에서는 http 응답 내용을 압축
	if(process.env.NODE_ENV == 'development'){
		app.use(morgan('dev'));
	}
	else if(process.env.NODE_ENV == 'production'){
		app.use(compress());
	}

	app.use(bodyParser.urlencoded({
		extended : true
	}));



	app.use(bodyParser.json());

	app.use(methodOverride());

	require('../../app/routes/index.server.routes.js')(app);
	
	return app;
};*/