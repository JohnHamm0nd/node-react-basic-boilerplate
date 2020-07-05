import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {loginUser} from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

function LoginPage(props) {
    const dispatch = useDispatch();
    
    //useState Hook 을 통해 state 값 설정
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    
    //Handler 를 만들어 input 값이 변경 될 때 마다 setState 로 state 값을 갱신해줌
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }
    
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    
    const onSubmitHandler = (event) => {
    //HTML 에서의 submit 은 페이지를 다시 로딩시킨다
    //이것을 막아 재로딩을 방지하고 body 에 이메일과 비밀번호를 넣음
        event.preventDefault()
        let body = {
            email: Email,
            password: Password
        }
        
        //Axios 를 통해 /api/user/login route 로 body 를 보내는 작업을 
        //dispatch 를 통해 함(_actions/user_action.js)
        //로그인이 성공했으면 메인페이지로 보냄
        //로그인 실패시 Error 창 띄우기
        dispatch(loginUser(body))
            .then(response => {
                if (response.payload.loginSuccess) {
                    props.history.push('/')
                } else {
                    alert('Error')
                }
            })

    }
    
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style={{display: 'flex', flexDirection: 'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type='email' value={Email} onChange={onEmailHandler}/>
                <label>Password</label>
                <input type='password' value={Password} onChange={onPasswordHandler}/>
                <br/>
                <button>
                    Login
                </button>
            </form>
        </div>
    )
}


export default withRouter(LoginPage);
