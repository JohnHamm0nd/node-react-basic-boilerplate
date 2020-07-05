import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';


function App() {
  return (
    <Router>
      <div>
        <Switch>
          
          {/*방법1. Route path 와 component 를 주어서 바로 사용*/}
          {/*
            exact 옵션:정확한 route(url)이 와야함,
            이 옵션이 없으면 뒤에 어떤 주소를 주어도 앞부분이 저 주소와 같으면
            저 route 로 들어감
          */}
          <Route exact path="/" component={LandingPage}/>
          <Route exact path="/login" component={LoginPage}/>
          
          {/*방법2. 나누어 사용*/}
          <Route exact path="/register">
            <RegisterPage />
          </Route>
          
        </Switch>
      </div>
    </Router>
  );
}

export default App;
