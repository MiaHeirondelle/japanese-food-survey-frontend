import React, {Component} from "react";
import {QuestionType} from "../model/session/QuestionType";
import BasicQuestionModel from "../model/question/BasicQuestionModel";
import ScreenCutoffBar from "../component/ScreenCutoffBar";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {ElementType} from "../model/session/ElementType";
import User from "../model/user/User";
import {displayInfoPopup} from "../util/PopupUtil";
import BasicQuestionAnswerModel from "../model/question/BasicQuestionAnswerModel";
import BasicQuestionReview from "../component/question_session/BasicQuestionReview";

class AdminQuestionSession extends Component {

  // Expects: user, socket, session, sessionFinishedCb`
  // State: session, socket, element
  constructor(props) {
    super(props);
    this.elementRef = React.createRef();
    this.state = {
      session: this.props.session,
      socket: this.props.socket,
      element: undefined
    }
    const self = this;
    this.props.socket.onmessage = async function (event) {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'question_selected':
          self.setState((previousState) => {
            return {...previousState, element: message.element}
          });
          break;
        case 'basic_question_review_selected':
          self.setState((previousState) => {
            return {...previousState, element: message.element, answers: message.answers}
          });
          break;
        case 'user_joined':
          const user = User.fromJson(message.user);
          if (user.id !== self.props.user.id) {
            displayInfoPopup(`User [${user.name}] joined!`)
          }
          break;
        case 'session_finished':
          self.state.socket.close();
          self.props.sessionFinishedCb();
          break;
        case 'timer_tick':
          if (self.elementRef.current && self.elementRef.current.setTime) {
            self.elementRef.current.setTime(message.time_left_in_ms / 1000);
          }
          break;
        case 'transition_to_next_element':
          break;

        default:
          console.error('Unknown message type', message);
      }
    }
  }

  render() {
    const element = this.state.element;
    if (element !== undefined) {
      switch (element.type) {
        case ElementType.QUESTION:
          return <Row className='FullHeightContent align-items-center text-center align-middle'>
            <Col>
              Waiting for users to respond to questions.
            </Col>
          </Row>;

        case ElementType.QUESTION_REVIEW:
          const reviewQuestion = element.question;
          switch (reviewQuestion.type) {
            case QuestionType.BASIC:
              const questionModel = BasicQuestionModel.fromJson(reviewQuestion);
              const answers = this.state.answers.map(BasicQuestionAnswerModel.fromJson);
              return (
                <Col className='FullHeightContent StretchContent'>
                  <ScreenCutoffBar/>
                  <BasicQuestionReview ref={this.elementRef} pageNumber={0} elementNumber={element.number} user={this.props.user} respondents={this.state.session.currentRespondents} question={questionModel} answers={answers}/>
                  <ScreenCutoffBar/>
                </Col>
              );

            default:
              return 'Unknown question type';
          }

        default:
          return 'Unknown element type';
      }
    } else {
      return null;
    }
  }
}

export default AdminQuestionSession;