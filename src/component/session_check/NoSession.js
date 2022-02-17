import React, {Component} from "react";
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class JoinSession extends Component {
  render() {
    return (
      <Row>
        <Col>
          <b>No session is currently in progress.</b>
        </Col>
      </Row>
    );
  }
}

export default JoinSession;