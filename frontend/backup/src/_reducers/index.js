import {combineReducers} from 'redux';
import user from './user_reducer';

//Reducer 가 하는 일
//어떻게 state 가 변하는지를 보여주고 그 변한 마지막 값을 리턴해줌
//state 는 서비스에 따라 (예-user, post, number, subscribe 등등)
//여러가지가 있기 때문에(개발자가 각 state 마다 reducer를 따로 만드는듯) reducer 는 각각 나뉘어 있다(boilerplate 파일 참고)
//combineReducers 을 이용해서 이러한 다양한 reducer 를 하나로 합쳐 주는 것
//예를 들어 user 와 post state 가 있으면
//user_reducer, post_reducer 를 만들고 사용, combineReducers 를 사용해 하나로 합침
const rootReducer = combineReducers({
    user
})


export default rootReducer;
