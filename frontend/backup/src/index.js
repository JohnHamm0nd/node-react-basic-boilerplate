import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import promiseMiddleware from'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';
import 'antd/dist/antd.css';

//Redux Store 사용하기
//Store 만들기: promiseMiddleware, ReduxThunk, createStore 를 같이 넣어 만든다 
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk) (createStore)
//Redux Store을 사용하려면 Provider 로 감싸줘야함
//store 로 만들어놓은 store 지정
//store 를 지정할 때 만들어놓은 reducer 를 지정하여 불러온다
//크롬에서 redux devtool extension 설치하고, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//를 뒤에 붙여준다(개발할때만 사용하는 거?)
ReactDOM.render(
  <Provider
    store = {createStoreWithMiddleware(Reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
      )}
  >
    <App />
  </Provider>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
