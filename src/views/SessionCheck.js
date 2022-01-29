import React, {Component} from 'react'
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";

class SessionCheck extends Component {
  // Expects `stateTransition` function.

  render() {
    return (
      <Row className='FullHeightContent align-items-center'>
        <Col className='col-lg-4 offset-lg-4 text-center'>
          {(document.cookie.match(/^(?:.*;)?\s*JFSBSESSIONID\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1]}
        </Col>
      </Row>
    );

  }
}

export default SessionCheck;