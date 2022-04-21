import React, {Component} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class CantJoinSession extends Component {
  render() {
    return (
      <Row>
        <Col>
          <b>セッションに参加できません</b>
        </Col>
      </Row>
    );
  }
}

export default CantJoinSession;