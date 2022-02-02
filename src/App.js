import './App.css';
import {AppState} from './component/model.js';
import React, {Component} from 'react'
import Login from './views/Login';
import SessionCheck from "./views/SessionCheck";
import PersonalInfo from "./views/PersonalInfo";
import QuestionSession from "./views/QuestionSession";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: AppState.LOGIN
    }
  }

  stateTransitionCb(state) {
    const self = this;
    return (data) =>
      self.setState(() => {
        return {...data, name: state};
      })
  }

  render() {
    switch (this.state.name) {
      case AppState.LOGIN:
        return <Login key='explanation' stateTransition={this.stateTransitionCb(AppState.SESSION_CHECK)}/>

      case AppState.SESSION_CHECK:
        return <SessionCheck key='sessionCheck' checkResult={this.state.checkResult}/>

      case AppState.PERSONAL_INFO:
        return <PersonalInfo key='personalInfo'/>

      case AppState.SESSION_IN_PROGRESS:
        return <QuestionSession key='questionSession'/>

      default:
        return <div>Invalid state.</div>
    }
  }
}

export default App;
