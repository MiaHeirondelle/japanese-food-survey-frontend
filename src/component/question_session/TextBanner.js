import React, {Component} from "react";
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";

class TextBanner extends Component {

  // Expects: text
  constructor(props) {
    super(props);
  }

  render() {
    return <Col className='StretchContent'>
      <Row className='StretchContainer align-middle align-items-center text-center '>
        <Col className='KeepLineBreaks fo'>
          <h1>{this.props.text}</h1>
        </Col>
      </Row>
      <Row className='StretchContent'/>
    </Col>
  }
}

export default TextBanner;