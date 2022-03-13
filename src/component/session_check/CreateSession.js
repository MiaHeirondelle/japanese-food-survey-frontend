import React, {Component} from "react";
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import config from "../../config";
import MultiSelector from "../common/MultiSelector";

class CreateSession extends Component {
  // expects 'respondents', 'onCreateCb'
  constructor(props) {
    super(props);
    this.respondentOptions = this.props.respondents.map(u => { return { id: u.id, name: u.name } });
    this.selectedRespondents = [];
  }


  async createSession(respondentIds) {
    await fetch(`${config['backend']['uri']}/session/create`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        respondents: respondentIds
      })
    });
  }

  async onClick() {
    await this.createSession(this.selectedRespondents.map(u => u.id));
    this.props.onCreateCb();
  }

  onSelectedUsersChange(users) {
    this.selectedRespondents = users;
  }

  render() {
    return (
      <Row>
        <Col>
          <MultiSelector options={this.respondentOptions} name="respondentSelector"
                         onSelectCb={this.onSelectedUsersChange.bind(this)}/>
          <Button variant='primary' onClick={this.onClick.bind(this)}>Create session</Button>
        </Col>
      </Row>
    );
  }
}

export default CreateSession;