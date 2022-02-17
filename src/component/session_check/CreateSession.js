import React, {Component} from "react";
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import config from "../../config";

class CreateSession extends Component {
  // expects 'onCreateCb'

  async createSession() {
    await fetch(`${config['backend']['uri']}/session/create`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // local: '95b29f26-2116-4a5c-a311-405b721a2a61
        respondents: ['f3df3662-b704-45ec-a88d-6b105e6962f3']
      })
    });
  }

  async onClick() {
    await this.createSession();
    this.props.onCreateCb();
  }

  render() {
    return (
      <Row>
        <Col>
          <Button variant='primary' onClick={this.onClick.bind(this)}>Create session</Button>
        </Col>
      </Row>
    );
  }
}

export default CreateSession;