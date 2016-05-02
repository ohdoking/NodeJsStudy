var passport = require('passport');
var mongoose = require('mongoose');


/*

	사용자 직렬화를 다루는 방식을 정의하기 위해 사용된다.

	사용자를 인증할때  피스포트는 세션에 _id 속성을 저장
	나중에 패스포트는 _id 속성을 사용해서 db 에서 user 객체를 가져옴

	 
*/
module.exports = function(){
	var User = mongoose.model('User');

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	//passport 와 salt 속성을 가져오지 않게 보증하기 위해 필드 옵션을 아래와 같이 사용함.
	passport.deserializeUser(function(id, done){
		User.findOne({
			_id : id
		}, '-password -salt',function(err,user){
			done(err,user);
		});
	});

	require('./strategies/local.js')();

}

