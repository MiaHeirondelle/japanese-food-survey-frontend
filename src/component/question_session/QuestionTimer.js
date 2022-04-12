import {Component} from "react";
import Row from 'react-bootstrap/Row';

class QuestionTimer extends Component {

  // Expects: currentTimeS
  constructor(props) {
    super(props);
  }

  render() {
    const timeString = `${Math.floor(this.props.currentTimeS / 60).toString().padStart(2, '0')}:${(this.props.currentTimeS % 60).toString().padStart(2, '0')}`
    return <Row className='text-right'><h4>残り時間: {timeString}</h4></Row>;
  }
}

export default QuestionTimer;