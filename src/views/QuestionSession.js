import React, {Component} from "react";
import {QuestionType} from "../model/session/QuestionType";
import BasicQuestion from "../component/question_session/BasicQuestion";
import QuestionModel from "../model/question/QuestionModel";
import {extractFormData} from "../util/FormUtil";
import ScreenCutoffBar from "../component/ScreenCutoffBar";
import Col from "react-bootstrap/Col";
import {ElementType} from "../model/session/ElementType";
import User from "../model/user/User";
import {displayInfoPopup} from "../util/PopupUtil";
import * as websocketClient from "../client/websocket";
import QuestionAnswerModel from "../model/question/QuestionAnswerModel";
import BasicQuestionReview from "../component/question_session/BasicQuestionReview";
import RepeatedQuestion from "../component/question_session/RepeatedQuestion";

class QuestionSession extends Component {

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
        case 'basic_question_selected':
          self.setState((previousState) => {
            return {...previousState, element: message.element}
          });
          break;
        case 'repeated_question_selected':
          self.setState((previousState) => {
            return {...previousState, element: message.element, answers: message.previous_answers}
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
          if (self.elementRef.current && self.elementRef.current.getForm) {
            self.elementRef.current.setTime(0);
            const form = self.elementRef.current.getForm();
            await self.submitFormData(form);
          } else {
            websocketClient.sendReadyForNextElement(self.state.socket);
          }
          break;

        default:
          console.error('Unknown message type', message);
      }
    }
  }

  async componentDidMount() {
    websocketClient.sendReadyForNextElement(this.state.socket);
  }

  async onSubmit(formEvent) {
    formEvent.preventDefault();
    formEvent.stopPropagation();
    const form = formEvent.currentTarget;
    await this.submitFormData(form)
  }

  async submitFormData(form) {
    if (form.checkValidity() === true) {
      const formValues = extractFormData(form);
      await websocketClient.provideQuestionAnswer(this.state.socket, this.state.element.question.id, formValues.likertValue, formValues.userComment);
      form.reset();
      window.scrollTo(0, 0);
    }
  }

  render() {
    const element = this.state.element;
    if (element !== undefined) {
      switch (element.type) {
        case ElementType.QUESTION:
          const selectedQuestion = element.question;
          switch (selectedQuestion.type) {
            case QuestionType.BASIC:
              const basicQuestionModel = QuestionModel.fromJson(selectedQuestion);
              return (
                <Col className='FullHeightContent StretchContent'>
                  <ScreenCutoffBar/>
                  <BasicQuestion ref={this.elementRef}  pageNumber={0} elementNumber={element.number} question={basicQuestionModel}
                                 onSubmit={this.onSubmit.bind(this)}/>
                  <ScreenCutoffBar/>
                </Col>
              );
            case QuestionType.REPEATED:
              const repeatedQuestionModel = QuestionModel.fromJson(selectedQuestion);
              const previousQuestionModel = QuestionModel.fromJson(element.previous_question);
              const answers = this.state.answers.map(QuestionAnswerModel.fromJson);
              return (
                <Col className='FullHeightContent StretchContent'>
                  <ScreenCutoffBar/>
                  <RepeatedQuestion ref={this.elementRef}  pageNumber={0} elementNumber={element.number} user={this.props.user} question={repeatedQuestionModel} previousQuestion={previousQuestionModel} previousAnswers={answers}
                                 onSubmit={this.onSubmit.bind(this)}/>
                  <ScreenCutoffBar/>
                </Col>
              );

            default:
              return 'Unknown question type';
          }

        case ElementType.QUESTION_REVIEW:
          const reviewQuestion = element.question;
          switch (reviewQuestion.type) {
            case QuestionType.BASIC:
              const questionModel = QuestionModel.fromJson(reviewQuestion);
              const answers = this.state.answers.map(QuestionAnswerModel.fromJson);
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

export default QuestionSession;