import React, {Component} from "react";
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import config from "../../config";
import MultiSelector from "../common/MultiSelector";

class CreateSession extends Component {
  // expects 'users', 'onCreateCb'

  async createSession() {
    await fetch(`${config['backend']['uri']}/session/create`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // local:
        // respondents: ['95b29f26-2116-4a5c-a311-405b721a2a61']
        respondents: ['f3df3662-b704-45ec-a88d-6b105e6962f3']
      })
    });
  }

  async onClick() {
    await this.createSession();
    this.props.onCreateCb();
  }

  onSelectedUsersChange(users) {
    console.log(users)
  }

  render() {
    return (
      <Row>
        <Col>
          <MultiSelector values={[{key: "tes1", label: "name1"}, {key: "test2", label: "name2"}]} name="userSelector"
                         onChangeCb={this.onSelectedUsersChange}/>
          <Button variant='primary' onClick={this.onClick.bind(this)}>Create session</Button>
        </Col>
      </Row>
    );
  }
}

export default CreateSession;