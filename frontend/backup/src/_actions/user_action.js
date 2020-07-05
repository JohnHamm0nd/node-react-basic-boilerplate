import Axios from 'axios'
import {
    LOGIN_USER, REGISTER_USER
} from './types';


export function loginUser(dataTosubmit) {
    //loginPage 로부터 이메일, 비밀번호를 받아 Axios 를 통해 /api/user/login route 로 보냄
    //받아온 결과를 reducer(_reducers/user_reducer.js) 로 보냄
    const request = Axios.post('/api/user/login', dataTosubmit)
        .then(response => response.data)
    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function registerUser(dataTosubmit) {
    const request = Axios.post('/api/user/register', dataTosubmit)
        .then(response => response.data)
    return {
        type: REGISTER_USER,
        payload: request
    }
}
