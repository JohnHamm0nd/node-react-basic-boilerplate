const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//비밀번호 암호화
//salt 가 몇글자인지 설정
const saltRounds = 10

//모델생성
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 20
    },
    email: {
        type: String,
        trim: true, //문자열 사이에 스페이스를 없애주는 역할
        unique: 1
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type: String,
        maxlength: 20
    },
    //일반유저, 관리자 등의 구분을 위해 role 변수를 주어 구분
    role: {
        type: Number,
        default: 0
    },
    image: String,
    //토큰을 주어 유효성 검사에 사용
    token: {
        type: String
    },
    //토큰의 유효기간
    tokenExp: {
        type: Number
    }
})


//mongoose 에 있는 기능
//save 란 명령이 오면 save 를 실행하기 전에 먼저 실행 후 save 실행 next 파라미터
//여기서 next 는 index 에 save?
userSchema.pre('save', function( next ) {
    //유저가 입력한 비밀번호를 가져와야 하기 때문에 this 를 user 로 지정(여기서 this 는 userSchema 를 가르킨다)
    var user = this;
    
    //유저가 비밀번호를 변경할 때만 암호화(처음 저장이나, 비밀번호를 변경할 떄만 작동한다)
    if (user.isModified('password')) {
        //비밀번호 암호화
        //salt 생성
        bcrypt.genSalt(saltRounds, function(err, salt) {
            //에러 발생시 next 로 err 리턴
            if (err) return next(err)
            //사용자가 입력한 비밀번호를 가져와 salt 를 넣어 암호화
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err)
                //정상 처리 시 password 를 hash (암호화된 비밀번호)로 변경
                user.passsword = hash
                next()
            })
        })
    } else {
        //비밀번호를 변경하는게 아닌 경우 바로 next
        next()
    }
})


//로그인
//유저스키마를 가져와 원하는 메소드 명(comparePassword)으로 메소드를 만들어줌
userSchema.methods.comparePassword = function (plainPassword, cb) {
    //유저가 로그인 하려고 입력한 비밀번호(plainPassword)와, 데이터 베이스에 있는 암호화된 비밀번호
    //가 맞는지 확인해야함
    //데이터베이스에 있는 암호화된 비밀번호를 복호화 할 순 없음
    //로그인 하려고 입력한 비밀번호를 암호화 하여 맞는지 확인해야함
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        //비밀번호가 다른경우 err
        if (err) return cb(err);
        //비밀번호가 맞는경우
        cb(null, isMatch);
    })
}

//JSONWEBTOKEN
userSchema.methods.generateToken = function(cb) {
    var user = this;
    //jsonwebtoken 을 이용해서 token 을 생성하기
    //user._id 와 'secretToken' (문자열이다) 을 합쳐서 토큰을 만든다
    //복호화 할때도 저 문자열을 알고 있어야 한다
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    //user 의 token 에 token 을 넣어준다
    user.token = token
    //저장
    //에러 발생시 에러 리턴, 정상처리시 user 리턴
    user.save(function (err, user) {
        if(err) return cb(err)
        cb(null, user)
    });
}

//Authentication
userSchema.statics.findByToken = function (token, cb) {
    var user = this;
    //토큰을 decode 한다(복호화)
    //토큰과 토큰을 만들때 사용 했던 문자열을 같이 넣어준다
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음
        //클라이언트에서 가져온 token 과 DB 에 보관된 토큰이 일치하는지 확인
        //findOne 은 내장메소드
        //user 모델에서 _id 가 복호화된 id(decoded) 이고 token 이 token 인 user 를 찾음
        //조건이 안맞으면 현재 로그인한 유저와 토큰의 유저가 다르다는 것 등의 err
        user.findOne({'_id': decoded, 'token': token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    });
}

//모델로 스키마를 감싸주기
//const 변수명 = mongoose.model('모델명(사용자지정인듯? 아니면 변수명과 같게?)', 스키마명)
const User = mongoose.model('User', userSchema)

//다른 곳에서 사용할 수 있게 export
module.exports = {User}
