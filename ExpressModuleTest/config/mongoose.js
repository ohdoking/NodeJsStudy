var config = require('./config');
var mongoose = require('mongoose');

module.exports = function(){
	var db = mongoose.connect(config.db);

	//User 모델 등록
	require('../app/models/users.server.model');

	return db;
};