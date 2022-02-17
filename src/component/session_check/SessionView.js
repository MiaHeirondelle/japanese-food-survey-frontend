import React, {Component} from "react";
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class SessionView extends Component {
  // expects 'user', 'admin', 'onBeginCb'
  render() {
    return (
      <Row>
        <Col>
          <b>Waiting for session to start.</b>
        </Col>
      </Row>
    );
  }
}

export default SessionView;