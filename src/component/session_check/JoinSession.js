import React, {Component} from "react";
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class JoinSession extends Component {
  // expects 'user', 'awaiting_users', 'onJoinCb'

  render() {
    return (
      <Row>
        <Col>
          <Button variant='primary' disabed={this.allowedToJoin()} onClick={this.props.onJoinCb}>Join</Button>
        </Col>
      </Row>
    );
  }

  allowedToJoin() {
    this.props.awaiting_users.includes(this.props.user.id);
  }
}

export default JoinSession;