import {Component} from "react";
import Row from 'react-bootstrap/Row';

class QuestionTimer extends Component {

  // Expects: currentTimeS
  constructor(props) {
    super(props);
  }

  render() {
    return <Row className='text-right'><h4>残り時間: {this.props.currentTimeS}</h4></Row>;
  }
}

export default QuestionTimer;