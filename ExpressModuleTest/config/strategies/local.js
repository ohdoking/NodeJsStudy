var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('mongoose').model('User');


/*

	passport.user 메소드로 LocalStrategty 전략을 등록

	LocalStrategty 생성자가 인수로 콜백 함수를 받는 방식 
	나중에 사용자를 인증하려 시도할때 이 콜백이 호출됨
*/
module.exports = function(){
	passport.use(new LocalStrategy(/*{
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },*/
		function(username, password, done){
			User.findOne({'username' : username},
				function(err,user){
					if(err){
						return done(err);
					}

					if(!user){
						return done(null, false, {
							message : 'Unknown User'
						});
					}

					if(!user.authenticate(password)){
						return done(null, false,{
							message : 'Invalid password'
						});
					}

					return done(null,user);
				}
			);	
		}
	));
};

