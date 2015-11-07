
var config = require('./config');
var express = require('express');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');


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
	console.log(config.sessionSecret)

	//express-session 모듈 사용
	// 현재 사용자를 식별하기 위해 서명된 식별자 쿠키를 저장한다.
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
	}));


	//ejs를 사용하기 위한 설정
	app.set('views','./app/views');
	app.set('view engine','ejs');

	require('../app/routes/index.server.routes.js')(app);
	
	//정적 파일 서비스
	//express.static 미들웨어는 라우팅 파일 호출 아래에 위치한다
	app.use(express.static('./public'));
	
	return app;
};