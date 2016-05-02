//process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_ENV = process.argv[2] || 'development';

//다른 구성에 앞서 몽구스 구성 파일을 가장 먼저 올려야 한다.
//(관례)이 모듈 다음에 올라오는 ㅇ어떤 모듈도 직접 User 모델을 올리지 않고서도 바로 User 모델을 사용할 수 있기 때문
var mongoose = require('./config/mongoose');
var express = require('./config/express');
var passport = require('./config/passport');

var db = mongoose();
var app = express();
var passport = passport();

app.listen(3000);

module.exports = app;

console.log("server localhost:3000");	
