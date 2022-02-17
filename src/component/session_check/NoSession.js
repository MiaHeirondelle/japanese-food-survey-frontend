import React, {Component} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class NoSession extends Component {
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

export default NoSession;