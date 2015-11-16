var users = require('../../app/controllers/users.server.controller');
var passport =require('passport');

module.exports = function(app){
	app.route('/users')
		.post(users.create)
		.get(users.list);

	app.route('/users/:userId')
		.get(users.read)
		.put(users.update)
		.delete(users.delete);

	//req.user객체를 채우기 위해 해당 매매개변수를 사용하는 다른 미들웨어에 앞서 수행될 미들웨어 app.param() 메소드
	app.param('userId',users.userById);

	app.route('/signup')
		.get(users.renderSignup)
		.post(users.signup);


	/*
		passport.authentication() 를 사용해 post 처리

		첫 인수
			정의된 전략으로 사용자 요청을 인증하려 시도
		둘째 인수
			options 객체
				successRedirect
					패스포터에게 성공적으로 사용자를 인증한 다음에 요청을 전환할 위치를 알려준다.
				failureRedirect
					패스포트에게 사용자 인증에 실패한 다음에 요청을 전환할 위치를 알려준다.
				failureFlash
					패스포트에 플래스 메시지를 사용할지 말지를 알려준다.
	*/
	app.route('/signin')
		.get(users.renderSignin)
		.post(passport.authenticate('local',{
			successRedirect : '/',
			failureRedirect: '/signin',
			failureFlash: true
		}));

		app.get('/signout',users.signout);
};