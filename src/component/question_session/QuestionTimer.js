import {Component} from "react";
import Row from 'react-bootstrap/Row';

class QuestionTimer extends Component {

  // Expects: startFromS, intervalS, onTimeoutCb
  constructor(props) {
    super(props);
    this.state = {
      currentTimeS: this.props.startFromS
    };
  }

  componentDidMount() {
    const self = this;
    const suspendedTask = () => setInterval(() => {
        self.setState((previousState) => {
          const newTime = previousState.currentTimeS - self.props.intervalS
          if (newTime > 0) {
            return {
              task: previousState.task,
              currentTimeS: previousState.currentTimeS - self.props.intervalS
            }
          } else {
            // clearInterval(previousState.task);
            self.props.onTimeoutCb();
            // restart timer
            return {currentTimeS: this.props.startFromS};
          }
        })
      },
      self.props.intervalS * 1000
    )
    this.setState({
      task: suspendedTask(),
      currentTimeS: this.props.startFromS
    });
  }

  render() {
    const timeString = `${Math.floor(this.state.currentTimeS / 60).toString().padStart(2, '0')}:${(this.state.currentTimeS % 60).toString().padStart(2, '0')}`
    return <Row className='text-right'><h4>残り時間: {timeString}</h4></Row>;
  }
}

export default QuestionTimer;