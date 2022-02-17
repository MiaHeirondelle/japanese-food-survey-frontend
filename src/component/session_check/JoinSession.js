import React, {Component} from "react";
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import config from "../../config";

class JoinSession extends Component {
  // expects 'onJoinCb'
  async joinSession() {
    await fetch(`${config['backend']['uri']}/session/join`, {
      method: 'POST',
      credentials: 'include',
    });
  }

  async onClick() {
    await this.joinSession();
    this.props.onJoinCb();
  }

  render() {
    return (
      <Row>
        <Col>
          <Button variant='primary' onClick={this.onClick.bind(this)}>Join session</Button>
        </Col>
      </Row>
    );
  }
}

export default JoinSession;