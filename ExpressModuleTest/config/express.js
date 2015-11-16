
var config = require('./config');
var express = require('express');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');
// flash 라는 세션 객체 영역에 임시 메시지를 저장하게 만드는 노드 모듈
var flash = require('connect-flash')


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

	app.use(flash());
	//passport 미들웨어 등록
	//패스포트 모듈을 부트스트래핑함
	app.use(passport.initialize());
	//사용자 세션을 추적하기 위해 익스프레스 세션을 사용
	app.use(passport.session());
	//route
	require('../app/routes/index.server.routes.js')(app);
	require('../app/routes/users.server.routes.js')(app);
	
	//정적 파일 서비스
	//express.static 미들웨어는 라우팅 파일 호출 아래에 위치한다
	app.use(express.static('./public'));
	
	return app;
};