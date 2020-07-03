const mongoose = require('mongoose');


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

//모델로 스키마를 감싸주기
//const 변수명 = mongoose.model('모델명(사용자지정인듯? 아니면 변수명과 같게?)', 스키마명)
const User = mongoose.model('User', userSchema)

//다른 곳에서 사용할 수 있게 export
module.exports = {User}
