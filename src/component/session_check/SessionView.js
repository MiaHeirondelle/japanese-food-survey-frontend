import React, {Component} from "react";
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class SessionView extends Component {
  // expects 'user', 'session', 'onBeginCb'
  onBegin() {

  }


  render() {
    return (
      <Row>
        <Col>
          <b>Waiting for session to start.</b>
          <br/>
          <Button hidden={!this.isAdminComponent()} variant='primary' onClick={this.onBegin.bind(this)}>Begin
            session</Button>
        </Col>
      </Row>
    );
  }


  isAdminComponent() {
    return this.props.session.containsAdmin(this.props.user);
  }
}

export default SessionView;