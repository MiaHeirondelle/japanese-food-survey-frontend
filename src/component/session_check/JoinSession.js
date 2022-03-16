import React, {Component} from "react";
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import * as client from "../../client/client"

class JoinSession extends Component {
  // expects 'onJoinCb' (session) => unit

  async onClick() {
    const session = await client.joinSession();
    this.props.onJoinCb(session);
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