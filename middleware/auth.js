const { User } = require('../models/User');


let auth = (req, res, next) => {
    //인증처리를 하는곳
    
    //클라이언트 쿠키에서 토큰을 가져온다
    //토큰을 발급할 때 x_auth 란 변수명으로 주었으므로 받을 때에도 x_auth 으로 받음
    let token = req.cooikes.x_auth;
    
    //토큰을 복호화 한 후 유저를 찾는다
    //로그인과 토큰발급과 마찬가지고 User 모델에 메소드를 만들어 사용한다
    User.findByToken(token, (err, user) => {
        //에러 발생시 에러 띄움
        if (err) throw err;
        //user 가 없다면 클라이언트에 에러 전송
        if (!user) return res.json({ isAuth: false, error: true});
        //user가 있으면
        req.token = token;
        req.user = user;
        //정상처리시 미들웨어에서 내보내기 위해 next()
        //에러발생시에는 미들웨어에서 다른곳으로 빠져나가게됨
        next();
    })
    
    //유저가 있으면 인증 Okay
    
    //유저가 없으면 인증 No!
}


module.exports = { auth };
