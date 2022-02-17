import './App.css';
import {AppState} from './component/model.js';
import React, {Component} from 'react'
import Login from './views/Login';
import SessionCheck from "./views/SessionCheck";
import PersonalInfo from "./views/PersonalInfo";
import QuestionSession from "./views/QuestionSession";
import config from "./config";
import Session from "./model/session/Session";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: AppState.LOGIN
    }
  }

  asyncStateTransitionCb(state, asyncCb) {
    const self = this;
    return async (data) => {
      const asyncData = await asyncCb();
      console.log(asyncData);
      self.setState((previousState) => {
        return {user: previousState.user, ...data, ...asyncData, name: state};
      })
    }
  }

  stateTransitionCb(state) {
    const self = this;
    return (data) =>
      self.setState((previousState) => {
        return {user: previousState.user, ...data, name: state};
      })
  }

  render() {
    switch (this.state.name) {
      case AppState.LOGIN:
        return <Login key='explanation' stateTransition={this.asyncStateTransitionCb(AppState.SESSION_CHECK, this.getSession)}/>;

      case AppState.SESSION_CHECK:
        return <SessionCheck key='sessionCheck' session={this.state.session} user={this.state.user}/>;

      case AppState.PERSONAL_INFO:
        return <PersonalInfo key='personalInfo'/>;

      case AppState.SESSION_IN_PROGRESS:
        return <QuestionSession key='questionSession' user={this.state.user}/>;

      default:
        return <div>Invalid state.</div>;
    }
  }

  async getSession() {
    const response = await fetch(`${config['backend']['uri']}/session`, {
      method: 'GET',
      credentials: 'include'
    });
    const sessionJson = await response.json();
    return {
      session: new Session(
        sessionJson.joined_users,
        sessionJson.awaiting_users,
        sessionJson.admin,
        sessionJson.status
      )
    }
  }
}

export default App;
