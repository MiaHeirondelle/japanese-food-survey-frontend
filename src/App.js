import './App.css';
import {AppState} from './component/model.js';
import React, {Component} from 'react'
import Login from './views/Login';
import SessionCheck from "./views/SessionCheck";
import RespondentData from "./views/RespondentData";
import QuestionSession from "./views/QuestionSession";
import AdminQuestionSession from "./views/AdminQuestionSession";
import * as client from "./client/client"
import {UserRole} from "./model/user/UserRole";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: AppState.LOGIN
    }
  }

  asyncStateTransitionStaticCb(state, asyncCb) {
    return this.asyncStateTransitionDynamicCb(_ => state, asyncCb);
  }

  asyncStateTransitionDynamicCb(stateFn, asyncCb) {
    const self = this;
    return async (data) => {
      const asyncData = await asyncCb();
      self.setState((previousState) => {
        const user = previousState.user || data.user;
        return {user, ...data, ...asyncData, name: stateFn(user, data)};
      })
    }
  }

  stateTransitionStaticCb(state) {
    return this.stateTransitionDynamicCb(_ => state);
  }

  stateTransitionDynamicCb(stateFn) {
    const self = this;
    return (data) =>
      self.setState((previousState) => {
        const user = previousState.user || data.user;
        return {user, ...data, name: stateFn(user, data)};
      })
  }

  render() {
    switch (this.state.name) {
      case AppState.LOGIN:
        return <Login key='explanation'
                      stateTransitionCb={this.loginTransitionCb.bind(this)}/>;

      case AppState.RESPONDENT_DATA:
        return <RespondentData key='respondentData'
                               stateTransitionCb={this.asyncStateTransitionStaticCb(AppState.SESSION_CHECK, this.getSessionState)}/>;

      case AppState.SESSION_CHECK:
        return <SessionCheck key='sessionCheck'
                             session={this.state.session}
                             user={this.state.user}
                             stateTransitionCb={this.stateTransitionDynamicCb(this.sessionCheckStateTransition)}
                             logoutCb={this.stateTransitionStaticCb(AppState.LOGIN)}/>;


      case AppState.SESSION_IN_PROGRESS:
        return <QuestionSession key='questionSession'
                                user={this.state.user}
                                socket={this.state.socket}
                                session={this.state.session}
                                sessionFinishedCb={this.asyncStateTransitionStaticCb(AppState.SESSION_CHECK, this.getSessionState)}/>;

      case AppState.ADMIN_SESSION_IN_PROGRESS:
        return <AdminQuestionSession key='adminQuestionSession'
                                     user={this.state.user}
                                     socket={this.state.socket}
                                     session={this.state.session}
                                     sessionFinishedCb={this.asyncStateTransitionStaticCb(AppState.SESSION_CHECK, this.getSessionState)}/>;

      default:
        return <div>Invalid state.</div>;
    }
  }

  async getSessionState() {
    const session = await client.getActiveSession();
    return {session};
  }

  sessionCheckStateTransition(user, data) {
    if (data && data.stopSession) {
      return AppState
    } else if (user && (user.role === UserRole.ADMIN))
      return AppState.ADMIN_SESSION_IN_PROGRESS;
    else
      return AppState.SESSION_IN_PROGRESS;
  }

  async loginTransitionCb(data) {
    if (data.user.role === UserRole.ADMIN || data.user.userDataSubmitted)
      await (this.asyncStateTransitionStaticCb(AppState.SESSION_CHECK, this.getSessionState)(data));
    else
      this.stateTransitionStaticCb(AppState.RESPONDENT_DATA)(data);
  }
}

export default App;
