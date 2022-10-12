import React, {Component} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class SessionPaused extends Component {
  render() {
    return (
      <Row>
        <Col>
          <b>セッションが現在停止中です。管理者がもうすぐセッションを続きますので、少々お待ちください。</b>
        </Col>
      </Row>
    );
  }
}

export default SessionPaused;