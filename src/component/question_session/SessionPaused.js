import React, {Component} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class SessionPaused extends Component {
  render() {
    return (
      <Row>
        <Col>
          <b>Session is currently paused. Administrator will resume the session.</b>
        </Col>
      </Row>
    );
  }
}

export default SessionPaused;