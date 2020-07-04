const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { User } = require('./models/User');
const { auth } = require('./middleware/auth');

const config = require('./config/key');


//bodyParser 사용, 옵션
//아래 타입으로 된 데이터를 가져와 사용할수 있게 해주는 것
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());

//mongodb 데이터베이스 연결
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err))

//메인페이지
app.get('/', (req, res) => res.send('Hello nodeJS!'))

//랜딩페이지 테스트
app.get('/api/hello', (req, res) => res.send('Hello 안녕!'))


//회원가입
//app: express, method: post, route(URL): register, request, response
//express 에서 app 이라는 변수명으로 /register route(URL) 을 통해 post 요청(request)을 받아서 응답(response) 함
app.post('api/user/register', (req, res) => {
    //회원 가입에 필요한 정보들을 client 에서 보내면
    //그것들을 데이터베이스에 넣는다.
    const user = new User(req.body)
    
    //mongodb method
    //저장 에러가 났을 때 err로 받음, err 이 있다면 res 로 json 응답
    user.save((err, userInfo) => {
        if (err) return res.json({success: false, err})
        //err 이 없으면(정상처리) userInfo로 받아(정상처리 응답인듯, 뭐가있는지 모르겠다?)
        //200 응답(정상처리) json 응
        return res.status(200).json({success: true})
    })
})

//cookieparser 사용
app.use(cookieParser());

//로그인
app.post('api/user/login', (req, res) => {
    //요청된 이메일이 데이터베이스에 있는지 찾기
    //mongodb 메소드
    User.findOne({email: req.body.email}, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: '해당 유저가 없습니다. 이메일 주소를 확인해 주세요.'
            })
        }
    })
    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 비밀번호를 확인
    user.comparePassword(req.body.password, (err, isMatch) =>{
        //isMatch 가 없는 경우(비밀번호가 틀렸음)
        if (!isMatch) {
            return res.join({
                loginSuccess: false,
                message: '비밀번호가 틀렸습니다.'})
        }
    })
    //비밀번호가 맞으면 토큰을 생성
    user.generateToken((err, user) => {
        //에러를 받았을 경우(User.js 의 generateToken 에서 err 리턴받은경우) 400 에러와 함꼐 에러 메세지 전달
        if (err) return res.status(400).send(err);
        //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지, 세션
        res.cookie('x_auth', user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id})
    });
})


//Authentication
//auth 미들웨어를 만들어 사용
app.post('api/user/auth', auth, (req, res) => {
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이 True 라는 말
    req.status(200).json({
        //미들웨어에서 req.user 를 넣어보냈기 때문에 사용할 수 있음
        //user 정보를 다 보내는 것은 어떤 페이지에서든지 유저 정보를 이용할 수 있게 하기 위함
        _id: req.user._id,
        //role:0 -> 일반유저, 그 외에는 관리자 라고 가정(서비스, 모델 설계에 따른다)
        isAdmin: req.user.role === 0 ? false: true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    })
})

//로그아웃
app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id},
        {token: ''},
        (err, user) => {
            if (err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            })
        }
    )
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))



