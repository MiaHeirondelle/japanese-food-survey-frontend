import React, {Component} from 'react'
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import {SessionStatus} from "../model/session/SessionStatus";
import NoSession from "../component/session_check/NoSession";
import SessionView from "../component/session_check/SessionView";
import CantJoinSession from "../component/session_check/CantJoinSession";
import JoinSession from "../component/session_check/NoSession";
import {UserRole} from "../model/user/UserRole";
import CreateSession from "../component/session_check/CreateSession";

class SessionCheck extends Component {
  // Expects 'user', 'session', 'refreshCb', 'stateTransitionCb'.

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
    switch (this.props.session.status) {
      case SessionStatus.NOT_CREATED:
        if (this.props.user.role === UserRole.ADMIN)
          return <CreateSession user={this.props.user} onCreateCb={this.props.refreshCb}/>;
        else
          return <NoSession/>;
      case SessionStatus.AWAITING_USERS:
      case SessionStatus.CAN_BEGIN:
        if (this.props.session.containsPendingRespondent(this.props.user))
          return <JoinSession user={this.props.user} session={this.props.session}/>;
        else if (this.props.session.containsCurrentRespondent(this.props.user))
          return <SessionView user={this.props.user} session={this.props.session}/>;
        else
          return <CantJoinSession/>;
      default:
        return 'Invalid session state';
    }
  }
}

export default SessionCheck;