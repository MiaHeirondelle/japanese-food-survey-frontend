import {Component} from "react";
import Row from 'react-bootstrap/Row';

class QuestionTimer extends Component {

  // Expects: currentTimeS
  constructor(props) {
    super(props);
  }

  render() {
    return <Row className='text-right d-inline'><h4 className='d-inline'>残り時間:</h4> <h2 className='d-inline'>{this.props.currentTimeS}</h2></Row>;
  }
}

export default QuestionTimer;