import React, {Component} from 'react'
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import {SessionStatus} from "../model/session/SessionStatus";
import JoinSession from "../component/session_check/JoinSession";
import WaitingToStartSession from "../component/session_check/WaitingToStartSession";
import CantJoinSession from "../component/session_check/CantJoinSession";
import NoSession from "../component/session_check/NoSession";
import {UserRole} from "../model/user/UserRole";
import CreateSession from "../component/session_check/CreateSession";
import config from "../config";
import User from "../model/user/User";
import Session from "../model/session/Session";

const SessionCheckState = {
  DEFAULT: 'default',
  CANT_JOIN_SESSION: 'cant_join_session',
  CREATE_SESSION: 'create_session',
  JOIN_SESSION: 'join_session',
  NO_SESSION: 'no_session',
  WAITING_TO_START_SESSION: 'waiting_to_start_session'
};

class SessionCheck extends Component {
  // Expects 'user', 'session', 'stateTransitionCb'.
  constructor(props) {
    super(props);
    this.state = {
      state: SessionCheckState.DEFAULT,
      session: props.session
    }
  }

  async loadRespondents() {
    const response = await fetch(`${config['backend']['uri']}/user/respondent/get/all`, {
      method: 'GET',
      credentials: 'include'
    });
    if (response.ok) {
      const usersJson = await response.json();
      return usersJson.users.map(u => new User(u.id, u.name, u.role));
    } else {
      return [];
    }
  }

  async updateFromSession(session) {
    if (session.status === SessionStatus.IN_PROGRESS) {
      this.props.stateTransitionCb();
    } else {
      switch (session.status) {
        case SessionStatus.NOT_CREATED:
          if (this.props.user.role === UserRole.ADMIN) {
            const respondents = await this.loadRespondents();
            this.setState({
              state: SessionCheckState.CREATE_SESSION,
              session: session,
              respondents: respondents
            });
          } else
            this.setState({
              state: SessionCheckState.NO_SESSION,
              session: session
            });
          break;

        case SessionStatus.AWAITING_USERS:
        case SessionStatus.CAN_BEGIN:
          if (session.containsPendingRespondent(this.props.user))
            this.setState({
              state: SessionCheckState.JOIN_SESSION,
              session: session
            });
          else if (session.containsParticipant(this.props.user))
            this.setState({
              state: SessionCheckState.WAITING_TO_START_SESSION,
              session: session
            });
          else
            this.setState({
              state: SessionCheckState.CANT_JOIN_SESSION,
              session: session
            });
          break;

        default:
          break;
      }
    }
  }

  async reload() {
    const session = await this.getSession();
    await this.updateFromSession(session);
  }

  async componentDidMount() {
    await this.updateFromSession(this.state.session);
  }

  render() {
    return (
      <Row className='FullHeightContent align-items-center'>
        <Col className='col-lg-4 offset-lg-4 text-center'>
          {this.renderContent()}
        </Col>
      </Row>
    );
  }

  renderContent() {
    switch (this.state.state) {
      case SessionCheckState.DEFAULT:
        return <div/>;

      case SessionCheckState.CANT_JOIN_SESSION:
        return <CantJoinSession/>;

      case SessionCheckState.CREATE_SESSION:
        return <CreateSession respondents={this.state.respondents} onCreateCb={this.reload.bind(this)}/>;

      case SessionCheckState.JOIN_SESSION:
        return <JoinSession onJoinCb={this.reload.bind(this)}/>;

      case SessionCheckState.NO_SESSION:
        return <NoSession/>

      case SessionCheckState.WAITING_TO_START_SESSION:
        return <WaitingToStartSession user={this.props.user} session={this.state.session}
                                      onBeginCb={this.props.stateTransitionCb}/>;
    }
  }

  async getSession() {
    const response = await fetch(`${config['backend']['uri']}/session`, {
      method: 'GET',
      credentials: 'include'
    });
    const sessionJson = await response.json();
    return new Session(
      sessionJson.joined_users,
      sessionJson.awaiting_users,
      sessionJson.admin,
      sessionJson.status
    );
  }
}

export default SessionCheck;