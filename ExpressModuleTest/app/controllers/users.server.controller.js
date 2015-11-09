var User = require('mongoose').model('User');

exports.create = function(req,res,nex){
	var user = new User(req.body);

	user.save(function(err){
		if(err){
			return next(err)
		}
		else{
			res.json(user);
		}
	});


};

exports.list = function(req,res,nex){

	//find는 인수를 4개까지 받을 수 있다.
	/*
		질의 : MongoDB 질의 객체
		필드 : (선택) 반환할 때 사용할 다큐먼트 필드를 지정하는 문자열
		옵션 : (선택) 옵션 객체
		콜백 : (선택) 콜백 함수

		질의 옵션은 mongoosejs docs에서 참고
	
		eg)
		User db에서 username 과 email만 10개 이후의 값을 10개만 뽑아라
		Userfind({},'username email',{skip : 10, limit : 10},function(err,users){.....}); 
	*/
	User.find({}, function(err, users){
		if(err){
			return next(err);
		}
		else{
			res.json(users);
		}
	});
};

exports.read = function(req,res){
	res.json(req.user);
};


//RUD를 수행시 단일 다큐먼트 조각을 위해 아래의 메소드를 사용
exports.userById = function(req,res,next,id){
	User.findOne({
		_id : id
	},function(err,user){
		if(err){
			return next(err)
		}
		else{
			req.user = user;
			next();
		}
	});
}

//update method
/*
	update();
	findOneAndUpdate();
	findByIdAndUpdate();
*/
exports.update = function(req, res, next){
	User.findByIdAndUpdate(req.user.id, req.body, function(err,user){
		if(err){
			return next(err);
		}
		else{
			res.json(user);
		}
	});
}

//delete method
/*
	remove();
	findOneAndRemove();
	findByIdAndRemove();

*/
//이미 userById() 미들웨어를 사용했으므로, 기존 다큐먼트를 삭제하는 가장 쉬운 방법은 remove이다
exports.delete = function(req, res, next){
	req.user.remove(function(err,user){
		if(err){
			return next(err);
		}
		else{
			res.json(user);
		}
	});
}



