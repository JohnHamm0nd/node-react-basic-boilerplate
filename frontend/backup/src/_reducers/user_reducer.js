import {
    LOGIN_USER, REGISTER_USER
} from '../_actions/types';


// 이전 state 와 action object 를 받은 후에 next state 를 return
export default function (state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return {...state, loginSuccess: action.payload}
            break;
        case REGISTER_USER:
            return {...state, register: action.payload}
            break;
        default:
            return state;
   }
} 
