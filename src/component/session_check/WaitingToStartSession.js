import React, {Component} from "react";
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import config from "../../config";

class WaitingToStartSession extends Component {
  // expects 'user', 'session', 'onBeginCb'

  async beginSession() {
    await fetch(`${config['backend']['uri']}/session/begin`, {
      method: 'POST',
      credentials: 'include'
    });
  }

  async onBegin() {
    await this.beginSession();
    this.props.onBeginCb();
  }

  render() {
    return (
      <Row>
        <Col>
          <b>Waiting for session to start.</b>
          <br/>
          <Button hidden={!this.isAdminComponent()} disabled={!this.isReadyToStart()} variant='primary' onClick={this.onBegin.bind(this)}>Begin
            session</Button>
        </Col>
      </Row>
    );
  }


  isAdminComponent() {
    return this.props.session.containsAdmin(this.props.user);
  }

  isReadyToStart() {
    return this.props.session.pendingRespondents.length === 0;
  }
}

export default WaitingToStartSession;