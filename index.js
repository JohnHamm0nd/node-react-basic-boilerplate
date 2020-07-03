const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { User } = require('./models/User')

const config = require('./config/key')

//bodyParser 옵션
//아래 타입으로 된 데이터를 가져와 사용할수 있게 해주는 것
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))
//application/json
app.use(bodyParser.json())

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello nodeJS!'))

//app: express, method: post, route(URL): register, request, response
//express 에서 app 이라는 변수명으로 /register route(URL) 을 통해 post 요청(request)을 받아서 응답(response) 함
app.post('/register', (req, res) => {
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

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))



