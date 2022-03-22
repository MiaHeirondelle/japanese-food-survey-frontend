import {Component} from "react";
import {QuestionType} from "../model/session/QuestionType";
import BasicQuestion from "../component/question_session/BasicQuestion";
import BasicQuestionModel from "../model/question/BasicQuestionModel";
import {extractUrlEncodedFormData} from "../util/FormUtil";
import ScreenCutoffBar from "../component/ScreenCutoffBar";
import Col from "react-bootstrap/Col";
import {ElementType} from "../model/session/ElementType";

class QuestionSession extends Component {

  // Expects: `user` `socket` `session`
  // State: session
  constructor(props) {
    super(props);
    this.state = {
      session: this.props.session
    }
  }

  onSubmit(formEvent) {
    formEvent.preventDefault();
    formEvent.stopPropagation();
    const form = formEvent.currentTarget;

    if (form.checkValidity() === true) {
      const formValues = extractUrlEncodedFormData(form);
    }
  }

  render() {
    const session = this.state.session;
    const elementNumber = session.current_element_number;
    const element = session.template.elements[elementNumber];
    switch (element.type) {
      case ElementType.QUESTION:
        const question = element.question;
        switch (question.type) {
          case QuestionType.BASIC:
            const questionModel = BasicQuestionModel.fromJson(question);
            return (
              <Col className='FullHeightContent StretchContent'>
                <ScreenCutoffBar/>
                <BasicQuestion pageNumber={0} questionModel={questionModel} elementNumber={elementNumber} onSubmit={this.onSubmit.bind(this)}/>
                <ScreenCutoffBar/>
              </Col>
            );

          default:
            return 'Unknown question type';
        }

      default:
        return 'Unknown element type';
    }
  }
}

export default QuestionSession;