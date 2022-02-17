import React, {Component} from 'react'
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";

class SessionCheck extends Component {
  // Expects `checkResult` string.

  render() {
    return (
      <Row className='FullHeightContent align-items-center'>
        <Col className='col-lg-4 offset-lg-4 text-center'>
          {`${this.props.user.name}`}
        </Col>
      </Row>
    );
  }
}

export default SessionCheck;