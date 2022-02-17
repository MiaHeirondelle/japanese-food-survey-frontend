import React, {Component} from "react";
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class CreateSession extends Component {
  // expects 'onCreateCb'
  render() {
    return (
      <Row>
        <Col>
          <Button variant='primary' onClick={this.props.onCreateCb}>Create session</Button>
        </Col>
      </Row>
    );
  }
}

export default CreateSession;