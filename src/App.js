import './App.css';
import {AppState} from './component/model.js';
import React, {Component} from 'react'
import Login from './views/Login';
import SessionCheck from "./views/SessionCheck";
import PersonalInfo from "./views/PersonalInfo";
import QuestionSession from "./views/QuestionSession";
import * as client from "./client/client"


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
        return <Login key='explanation'
                      stateTransitionCb={this.asyncStateTransitionCb(AppState.SESSION_CHECK, this.getSessionState)}/>;

      case AppState.SESSION_CHECK:
        return <SessionCheck key='sessionCheck' session={this.state.session} user={this.state.user}
                             stateTransitionCb={this.stateTransitionCb(AppState.SESSION_IN_PROGRESS)}/>;

      case AppState.PERSONAL_INFO:
        return <PersonalInfo key='personalInfo'/>;

      case AppState.SESSION_IN_PROGRESS:
        return <QuestionSession key='questionSession' user={this.state.user}/>;

      default:
        return <div>Invalid state.</div>;
    }
  }

  async getSessionState() {
    const session = await client.getSession();
    return {session};
  }
}

export default App;
