import {Component} from "react";
import {QuestionSessionState} from "../model/session/QuestionSessionState";
import BasicQuestion from "../component/BasicQuestion";
import BasicQuestionModel from "../model/BasicQuestionModel";
import {extractUrlEncodedFormData} from "../util/FormUtil";
import ScreenCutoffBar from "../component/ScreenCutoffBar";
import Col from "react-bootstrap/Col";


class QuestionSession extends Component {

  // Expects: `stateTransition` function,
  // State: sessionState
  constructor(props) {
    super(props);
    this.sessionState = QuestionSessionState.BASIC_QUESTION;
  }

  onSubmit(formEvent) {
    formEvent.preventDefault();
    formEvent.stopPropagation();
    const form = formEvent.currentTarget;

    if (form.checkValidity() === true) {
      const formValues = extractUrlEncodedFormData(form);
      console.log(formValues);
    }
  }

  render() {
    switch (this.sessionState) {
      case QuestionSessionState.BASIC_QUESTION:
        const questionModel = new BasicQuestionModel(
          'QuestionId',
          1,
          'あなたは、「涙の出ないタマネギ」を\n食べてみたいと思いますか？',
          'まったく\n食べたくない',
          'とても\n食べてみつぃ'
        )
        return (
          <Col className='FullHeightContent StretchContent'>
            <ScreenCutoffBar/>
            <BasicQuestion pageNumber={0} questionModel={questionModel} onSubmit={this.onSubmit.bind(this)}/>
            <ScreenCutoffBar/>
          </Col>
        );

      default:
        return 'Unknown state';
    }
  }
}

export default QuestionSession;