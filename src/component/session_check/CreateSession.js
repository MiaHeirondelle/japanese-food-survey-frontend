import React, {Component} from "react";
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import MultiSelector from "../common/MultiSelector";
import * as client from "../../client/client"

class CreateSession extends Component {
  // expects 'respondents', 'onCreateCb' (session) => unit
  constructor(props) {
    super(props);
    this.respondentOptions = this.props.respondents.map(u => {
      return {id: u.id, name: u.name}
    });
    this.state = {
      selectedRespondents: []
    }
    this.selectedRespondents = [];
  }

  async onClick() {
    const session = await client.createSession(this.state.selectedRespondents.map(u => u.id));
    this.props.onCreateCb(session);
  }

  onSelectedUsersChange(users) {
    this.setState({
      selectedRespondents: users
    });
  }

  render() {
    return (
      <Row>
        <Col>
          <MultiSelector options={this.respondentOptions} name="respondentSelector"
                         onChangeCb={this.onSelectedUsersChange.bind(this)}/>
          <Button className='mt-2' disabled={this.state.selectedRespondents.length === 0} variant='primary'
                  onClick={this.onClick.bind(this)}>セッションを作成</Button>
        </Col>
      </Row>
    );
  }
}

export default CreateSession;