var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

//사용자 스키마와 모델 생성

/*
	* 기본값 정의
		default : 기본값 정의
	 

	* 스키마 변경자 활용

	- 미리 정의된 변경자
		trim : 앞뒤 여백 삭제
		uppercase : 필드값을 대문자로 바꿈

	- 맞춤식 설정 변경자
		다큐먼트를 저장하기 앞서 데이터를 조작하는 맞춤식 설정 변경자 정의 가능
		set : 

	- 맞춤식 인출 변경자
		다음층으로 다큐먼트를 보내기 앞서 기존 데이터를 변경하기 위해 쓰인다.
		get:


	변경자는 강력하며, 시간을 절약할 수 있지만, 
	예상치 못한 애플리케이션 동작방식을 피하기 위해 주의 깊게 사용해야한다.

	* 가상 속성 추가

		실제로 다큐먼트에 존재하지 않는 다큐먼트 속성을 동적으로 계산하기를 원하는 경우 사용
		가상 속성 - 여러 공토 요구 사항을 풀기위해 사용 됨

		영속적으로 저장되지 않고 애플리케이션 층에서 다큐먼트를 표현을 변경하게 허용함

	* 색인을 사용한 질의 최적화

		질의 최적화를 위해 다양한 색인 유형을 지원
		부색인을 정의 할 수도 있음.
		
		unique 색인 : 컬렉션에서 다큐먼트 필드의 유일성을 검증
		index 색인 : 부색인


*/
var UserSchema = new Schema({

	firstName:String,
	lastName:String,
	email:{
		type : String,
		match : [/.+\@.+\..+/,"Please fill a valid email address"]
	},
	username:{
		type:String,
		trim:true,
		required : 'Username is required',
		unique:true
	},
	password:{
		type: String,
		validate:[
			function(password){
				return password.length >= 6
			},
			'Password should be longer'
		]
	},
	salt:{
		type : String
	},
	provider:{
		type : String,
		requried : 'provider is requried'
	},
	providerId: String,
	providerData : {},
	created:{
		type:Date,
		default: Date.now
	},
	website:{
		type: String,
		set: function(url){
			if(!url){
				return url;
			}
			else{
				if(url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0){
					url = 'http://' + url;
				}
				return url;
			}

		}
		/*,get: function(url){
			if(!url){
				return url;
			}
			else{
				if(url.indexOf('http://') !== 0 %% url.indexOf('https://') !== 0){
					url = 'http://' + url;
				}
				return url;
			}
		}*/
	}

});


// UserSchema.set('toJson', {getters: true});

//가상 속성
/*
1. 

UserSchema.virtual('fullName').get(function(){
	return this.firstName + ' ' + this.lastName;
})

 UserSchema.set('toJson', {getters: true, virtuals : true});

2. 


UserSchema.virtual('fullName').get(function(){
	return this.firstName + ' ' + this.lastName;
}).set(function(){
	var splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';

});

*/


//모델 생성
//mongoose.model('User',UserSchema);


//맞춤식 모델 메소드 정의

/*
	맞춤식 정적 메소드 정의

		정적 모델 메소드
		스키마의 statics 속성의 일원으로 선언함
*/

//이 메소드는 모델의 findOne 메소드를 사용해 특정 username을 포함한 사용자의 다큐먼트를 인출
UserSchema.statics.findOneByUsername = function(username, callback){
	this.findOne({username : new RegExp(username, 'i')}, callback);
};

/*
	맞춤식 인스턴스 메소드 정의

	인스턴스 메소드를 사용하면 코드 기반 크기를 줄이고,
	 애플리케이션 코드를 적절히 재사용하게 도와줌
*/

/*UserSchema.methods.authentication = function(password){
	return this.password === password;
}*/

//호출 
// user.authentication('password');


//모델 검증

/*

	데이터 마셜리을 다룰때 고민하는 문제
	검증을 모델층에서 수행하는것이 더 유용함

	몽구스는 
	1.단순 검증기
	2.복잡한 맞춤식 검증기를 지원한다.

	검증기는 다큐먼트 필드 수준에서 정의되며, 다큐먼트가 저장될 때 수행된다.
	검증 오류가 발생하면, 저장 연산은 중단되며 오류가 콜백으로 전달된다.


	- 미리 정의된 검증기 
		다양한 유형의 검증기를 지원
		대부분 타입과 관련된 검증기 
		
		required: 애플리케이션의 기본 검증기는 당연히 값의 존재 유무 확인
		match : 
		enum :

		eg)
		//값이 존재하는지 유뮤 확인 빠지면 저장 안함
		username:{
			type:String,
			trim:true,
			unique:true,
			**required : true
		},

		// 올바른 이메일 패턴인지 검증후 아닌 경우 저장 안함
		email:{
			type : String,
			index : true,
			match : /+.\@.+\..+/
		},
		//세가지 가능한 문자열만 받아들이므로 다른 값이오면 다큐먼트를 저장 안함 
		 role :{
			type : String,
			enum:['Admin', 'Owner', 'User']
		 }

	 - 맞춤식 검증기

	 	독자적인 맞춤식 검증기를 지원

	 	맞춤식 검증기를 정의하는 작어벵는 validate 속성을 사용
	 	validate 속성값은 검증 함수와 오류메시지를 포함한 배열이 되어야함

	 	eg)

	 	password:{
			type: String,
			validate:[
				function(password){
					return password.length >= 6
				},
				'Password should be longer'
			]
	 	},

	 	몽구스 검증 기능은 상당히 강력하며 모델을 제어하고 사용자가 무엇이 잘못되었는지 이해를 도울 수 있는 적절한 오류 처리가 가능하게 만든다.


*/


UserSchema.virtual('fullName').get(function(){
	return this.firstName + ' ' + this.lastName;
}).set(function(){
	var splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';

});


/*

	패스포트를 위한 설정

	salt 속성
		각각 암호를 해시하기 위해 사용
	provider 속성
		사용자를 등록하기위해 사용되는 전략을 지시
	providerId 속성
		인증 전략을 위한 사용자 식별자를 지시
	providerData 속성
		OAuth 공급자로부터 인출한 사용자 객체를 저장하기 위함

*/


//사용자의 비밀번호를 해시 하기 위해 pre-save 미들웨어를 생성

UserSchema.pre('save', function(next){
	if(this.password){
		//자동으로 생성된 가상 난수 해시 솔트를 만듬.
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'),'base64');
		// 현재 사용자의 비밀번호를 hashPasword() 인스턴스를 사용해 해시로 처리된 비밀번호로 치환
		this.password = this.hashPassword(this.password);
	}

	next();
});

UserSchema.methods.hashPassword = function(password){
	return crypto.pbkdf2Sync(password, this.salt, 10000 ,64).toString('base64');
};

UserSchema.methods.authentication = function(password){
	return this.password === this.hashPassword(password);
}

//새로운 사용자가 선택 가능한 유일한 이름ㅇ르 찾기위해 사용
//OAuth 인증을 다룰때 사용
UserSchema.statics.findUniqueUsername = function(username, suffix, callback){
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		user : possibleUsername
	}, function(err,user){
		if(!err){
			if(!user){
				callback(possibleUsername);
			}
			else{
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		}
		else{
			callback(null);
		}
	});
};


UserSchema.set('toJson', {getters: true, virtuals : true});

//모델 생성
mongoose.model('User',UserSchema);
