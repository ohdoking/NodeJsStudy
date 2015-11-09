var users = require('../../app/controllers/users.server.controller');

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
};