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
import * as client from "../client/client";
import * as websocketClient from "../client/websocket";
import Session from "../model/session/Session";
import User from "../model/user/User";
import {displayInfoPopup, displayWarningPopup} from "../util/PopupUtil";
import ScreenCutoffBar from "../component/ScreenCutoffBar";
import Button from "react-bootstrap/Button";


const SessionCheckState = {
  DEFAULT: 'default',
  CANT_JOIN_SESSION: 'cant_join_session',
  CREATE_SESSION: 'create_session',
  JOIN_SESSION: 'join_session',
  NO_SESSION: 'no_session',
  WAITING_TO_START_SESSION: 'waiting_to_start_session'
};

class SessionCheck extends Component {
  // Expects 'user', 'session', 'stateTransitionCb', `logoutCb`.
  constructor(props) {
    super(props);
    this.state = {
      state: SessionCheckState.DEFAULT,
      session: props.session,
      socket: undefined
    }
  }

  // todo: bug with 2 websockets
  async updateFromSession(session) {
    if (session.status === SessionStatus.IN_PROGRESS) {
      if (this.state.socket === undefined) {
        const socket = await websocketClient.connectToSession();
        this.props.stateTransitionCb({session, socket});
      } else {
        this.props.stateTransitionCb({session, socket: this.state.socket});
      }
    } else {
      switch (session.status) {
        case SessionStatus.NOT_CREATED:
          if (this.props.user.role === UserRole.ADMIN) {
            const respondents = await client.getAllRespondents();
            this.setState({
              state: SessionCheckState.CREATE_SESSION,
              session: session,
              respondents: respondents,
              socket: this.state.socket
            });
          } else
            this.setState({
              state: SessionCheckState.NO_SESSION,
              session: session,
              socket: this.state.socket
            });
          break;

        case SessionStatus.AWAITING_USERS:
        case SessionStatus.CAN_BEGIN:
          if (session.containsPendingRespondent(this.props.user)) {
            this.setState({
              state: SessionCheckState.JOIN_SESSION,
              session: session,
              socket: this.state.socket
            });
          } else if (session.containsParticipant(this.props.user)) {
            const websocket = await this.getOrCreateSessionWebsocket();
            this.setState({
              state: SessionCheckState.WAITING_TO_START_SESSION,
              session: session,
              socket: websocket
            });
          } else
            this.setState({
              state: SessionCheckState.CANT_JOIN_SESSION,
              session: session,
              socket: this.state.socket
            });
          break;

        default:
          break;
      }
    }
  }

  async componentDidMount() {
    await this.updateFromSession(this.state.session);
  }

  async connectToSession(session) {
    await this.updateFromSession(session);
    const websocket = this.getOrCreateSessionWebsocket();
    this.setState((previousState) => {
      return {...previousState, socket: websocket};
    });
  }

  async getOrCreateSessionWebsocket() {
    if (this.state.socket)
      return this.state.socket;
    else
      return await this.createSessionWebsocket();
  }

  async createSessionWebsocket() {
    const socket = await websocketClient.connectToSession();
    this.setWebSocketCallbacks(socket);
    return socket;
  }

  setWebSocketCallbacks(socket) {
    const self = this;
    socket.onmessage = async function (event) {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'user_joined':
          const userJoinedSession = Session.fromJson(message.session);
          const user = User.fromJson(message.user);
          await self.updateFromSession(userJoinedSession);
          if (user.id !== self.props.user.id) {
            displayInfoPopup(`ユーザー[${user.name}]がジョインされました`)
          }
          break;
        case 'session_began':
          const beganSession = Session.fromJson(message.session);
          socket.onmessage = function (event) {
            const message = JSON.parse(event.data);
            console.log('Skipping socket message', message);
          }
          self.props.stateTransitionCb({socket, session: beganSession});
          break;
        default:
          console.error('Unknown message type', message);
      }
    }
    socket.onerror = function (event) {
      console.error('error', event);
    }
    socket.onclose = function (event) {
      console.log('disconnected', event);
      displayWarningPopup('サーバーから切断されました。問題がある場合は、ページを更新してください')
    }
  }

  async onLogoutClick() {
    await client.logout();
    this.props.logoutCb();
  }

  async onStopSessionCb() {
    this.state.socket.onClose = undefined;
    this.state.socket.close();
    this.setState((previousState) => {
      return {...previousState, socket: undefined}
    });
    await client.stopSession();
    await this.updateFromSession({status: SessionStatus.NOT_CREATED});
  }

  render() {
    return (
      <Col className='FullHeightContent StretchContent'>
        <ScreenCutoffBar/>
        <Row className='pt-2'>
          <Button onClick={this.onLogoutClick.bind(this)}>ログアウト</Button>
        </Row>
        <br/>
        <Col className='StretchContent'>
          <Row className='StretchContainer align-middle align-items-center text-center '>
            <Col className='col-lg-4 offset-lg-4 text-center'>
              {this.renderContent()}
            </Col>
          </Row>
          <Row className='StretchContent'/>
        </Col>
        <ScreenCutoffBar/>
      </Col>
    );
  }

  renderContent() {
    switch (this.state.state) {
      case SessionCheckState.DEFAULT:
        return <div/>;

      case SessionCheckState.CANT_JOIN_SESSION:
        return <CantJoinSession/>;

      case SessionCheckState.CREATE_SESSION:
        return <CreateSession respondents={this.state.respondents} onCreateCb={this.connectToSession.bind(this)}/>;

      case SessionCheckState.JOIN_SESSION:
        return <JoinSession onJoinCb={this.connectToSession.bind(this)}/>;

      case SessionCheckState.NO_SESSION:
        return <NoSession/>

      case SessionCheckState.WAITING_TO_START_SESSION:
        return <WaitingToStartSession user={this.props.user}
                                      session={this.state.session}
                                      socket={this.state.socket}
                                      onStopSessionCb={this.onStopSessionCb.bind(this)}/>;
    }
  }
}

export default SessionCheck;