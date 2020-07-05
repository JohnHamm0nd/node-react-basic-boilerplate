import React, {useState} from 'react'
import {useDispatch} from 'react-redux';
import {registerUser} from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

function RegisterPage(props) {
    const dispatch = useDispatch();
    
    //useState Hook 을 통해 state 값 설정
    const [Email, setEmail] = useState('');
    const [Name, setName] = useState('');
    const [Password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    
    //Handler 를 만들어 input 값이 변경 될 때 마다 setState 로 state 값을 갱신해줌
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }
    
    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }
    
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    
    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    }
    
    const onSubmitHandler = (event) => {
    //HTML 에서의 submit 은 페이지를 다시 로딩시킨다
    //이것을 막아 재로딩을 방지하고 body 에 이메일과 이름, 비밀번호를 넣음
        event.preventDefault()
    //비밀번호 확인
        if (Password !== ConfirmPassword) {
            return alert('비밀번호를 확인해 주세요.');
        }

        let body = {
            email: Email,
            name: Name,
            password: Password
        }
        
        //Axios 를 통해 /api/user/register route 로 body 를 보내는 작업을 
        //dispatch 를 통해 함(_actions/user_action.js)
        //로그인이 성공했으면 메인페이지로 보냄
        //로그인 실패시 Error 창 띄우기
        dispatch(registerUser(body))
            .then(response => {
                if (response.payload.success) {
                    props.history.push('/login')
                } else {
                    alert('회원가입 실패!')
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
                <label>Name</label>
                <input type='text' value={Name} onChange={onNameHandler}/>
                <label>Password</label>
                <input type='password' value={Password} onChange={onPasswordHandler}/>
                <label>Confirm Password</label>
                <input type='password' value={ConfirmPassword} onChange={onConfirmPasswordHandler}/>
                <br/>
                <button>
                    회원 가입
                </button>
            </form>
        </div>
    )
}


export default withRouter(RegisterPage);
