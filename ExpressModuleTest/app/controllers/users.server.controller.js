var User = require('mongoose').model('User');
var passport = require('passport');

// 몽구스 error 객체에서 통합된 오류 메시지를 반환하는 비공개 메소드
var getErrorMessage = function(err) {
    // Define the error message variable
    var message = '';

    // If an internal MongoDB error occurs get the error message
    if (err.code) {
        switch (err.code) {
            // If a unique index error occurs set the message error
            case 11000:
                message = 'Duplicate Key';
                break;
            case 11001:
                message = 'Username already exists';
                break;
            // If a general error occurs set the message error
            default:
                message = 'Something went wrong';
        }
    } 
    else {
        // Grab the first error message from a list of possible errors
        for (var errName in err.errors) {
            if (err.errors[errName].message){ 
            	message = err.errors[errName].message;
            }
        }
    }

    // Return the message error
    return message;
};

exports.renderSignin = function(req, res, next) {
  if (!req.user) {
    res.render('signin', {
      title: 'Sign-in Form',
      messages: req.flash('error') || req.flash('info')
    });
  } 
  else {
    return res.redirect('/');
  }
};

exports.renderSignup = function(req, res, next) {
  if (!req.user) {
    res.render('signup', {
      title: 'Sign-up Form',
      messages: req.flash('error')
    });

  } 
  else {
    return res.redirect('/');
  }
};

exports.signup = function(req, res, next) {
  if (!req.user) {
    var user = new User(req.body);
    var message = null;

    user.provider = 'local';

    user.save(function(err) {
      if (err) {
        var message = getErrorMessage(err);

        req.flash('error', message);
        return res.redirect('/signup');
        
      }
      // passport.authenticate() 메소드를 사용할때 자동으로 호출됨
      // 새로운 사용자를 등록 할 때는 req.login()을 수동으로 호출하는 방식을 주로 사용
      req.login(user, function(err) {
        if (err) return next(err);
        return res.redirect('/');
      });
    });
  } 
  else {
    return res.redirect('/');
  }
};

exports.signout = function(req, res) {
	//인증된 세션을 무효화 하기위해 패스포트 모듈이 제공하는 메소드
  req.logout();
  res.redirect('/');
};



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

