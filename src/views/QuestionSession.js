import React, {Component} from "react";
import {QuestionType} from "../model/session/QuestionType";
import BasicQuestion from "../component/question_session/BasicQuestion";
import QuestionModel from "../model/question/QuestionModel";
import {extractFormData} from "../util/FormUtil";
import Col from "react-bootstrap/Col";
import {ElementType} from "../model/session/ElementType";
import * as websocketClient from "../client/websocket";
import QuestionAnswerModel from "../model/question/QuestionAnswerModel";
import BasicQuestionReview from "../component/question_session/BasicQuestionReview";
import RepeatedQuestion from "../component/question_session/RepeatedQuestion";
import Row from "react-bootstrap/Row";
import QuestionTimer from "../component/question_session/QuestionTimer";
import RepeatedQuestionReview from "../component/question_session/RepeatedQuestionReview";
import TextBanner from "../component/question_session/TextBanner";
import SessionPaused from "../component/question_session/SessionPaused";

class QuestionSession extends Component {

  // Expects: user, socket, session, sessionFinishedCb`
  // State: session, socket, element
  constructor(props) {
    super(props);
    this.state = {
      session: this.props.session,
      socket: this.props.socket,
      currentTimeS: 0,
      element: undefined,
      paused: false
    }
    const self = this;
    // todo: set time from messages
    this.props.socket.onmessage = async function (event) {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'basic_question_selected':
          self.setState((previousState) => {
            return {...previousState, element: message.element, paused: false};
          });
          break;
        case 'repeated_question_selected':
          self.setState((previousState) => {
            return {...previousState, element: message.element, answers: message.previous_answers, paused: false};
          });
          break;
        case 'basic_question_review_selected':
          self.setState((previousState) => {
            return {...previousState, element: message.element, answers: message.answers, paused: false};
          });
          break;
        case 'repeated_question_review_selected':
          self.setState((previousState) => {
            return {
              ...previousState,
              element: message.element,
              answers: message.answers,
              previousAnswers: message.previous_answers,
              paused: false
            };
          });
          break;
        case 'text_selected':
          self.setState((previousState) => {
            return {
              ...previousState,
              element: message.element,
              paused: false
            };
          });
          break;
        case 'session_paused':
          self.setState((previousState) => {
            return {
              ...previousState,
              paused: true
            };
          });
          break;
        case 'user_joined':
          break;
        case 'session_finished':
          self.state.socket.close();
          self.props.sessionFinishedCb();
          break;
        case 'timer_tick':
          self.setState((previousState) => {
            return {...previousState, currentTimeS: message.time_left_in_ms / 1000};
          });
          break;
        default:
          console.error('Unknown message type', message);
      }
    }
  }

  async componentDidMount() {
    websocketClient.readyToProceed(this.state.socket);
  }

  async onSubmit(formEvent) {
    formEvent.preventDefault();
    formEvent.stopPropagation();
    const form = formEvent.currentTarget;
    await this.submitFormData(form)
  }

  async onChange(formEvent) {
    const form = formEvent.target.form;
    if (form) {
      await this.submitTemporaryFormData(form)
    }
  }

  async submitFormData(form) {
    if (form.checkValidity() === true) {
      const formValues = extractFormData(form);
      await websocketClient.provideQuestionAnswer(this.state.socket, this.state.element.question.id, formValues.likertValue, formValues.userComment);
      form.reset();
      window.scrollTo(0, 0);
    }
  }

  async submitTemporaryFormData(form) {
    if (form.checkValidity() === true) {
      const formValues = extractFormData(form);
      await websocketClient.provideIntermediateQuestionAnswer(this.state.socket, this.state.element.question.id, formValues.likertValue, formValues.userComment);
    }
  }

  renderWithTopbar(component) {
    const elementNumber = this.state.element ? this.state.element.number : 0;
    const elementLimit = this.state.session.template.elements.length;
    return (
      <Col className='FullHeightContent StretchContent'>
        <Row className='align-items-center mt-lg-3 mx-lg-4'>
          <Col className='col-lg-10'>
            <h6>画面{elementNumber}/{elementLimit}</h6>
          </Col>
          <Col className='text-end col-lg-2'>
            <QuestionTimer currentTimeS={this.state.currentTimeS}/>
          </Col>
        </Row>
        <br/>
        {component}
      </Col>
    );
  }

  render() {
    const element = this.state.element;
    if (this.state.paused) {
      return this.renderWithTopbar(
        <Col className='StretchContent'>
          <Row className='StretchContainer align-middle align-items-center text-center '>
            <SessionPaused key='session-paused'/>
          </Row>
          <Row className='StretchContent'/>
        </Col>
      )
    }
    if (element !== undefined) {
      switch (element.type) {
        case ElementType.QUESTION:
          const selectedQuestion = element.question;
          switch (selectedQuestion.type) {
            case QuestionType.BASIC:
              const basicQuestionModel = QuestionModel.fromJson(selectedQuestion);
              return this.renderWithTopbar(
                <Col className='StretchContent'>
                  <BasicQuestion key={`basic-question-${basicQuestionModel.id}`}
                                 question={basicQuestionModel}
                                 onSubmit={this.onSubmit.bind(this)}
                                 onChange={this.onChange.bind(this)}/>
                </Col>
              );
            case QuestionType.REPEATED:
              const repeatedQuestionModel = QuestionModel.fromJson(selectedQuestion);
              const previousQuestionModel = QuestionModel.fromJson(element.previous_question);
              const answers = this.state.answers.map(QuestionAnswerModel.fromJson);
              return this.renderWithTopbar(
                <Col className='StretchContent'>
                  <RepeatedQuestion key={`repeated-question-${repeatedQuestionModel.id}`}
                                    user={this.props.user}
                                    question={repeatedQuestionModel}
                                    previousQuestion={previousQuestionModel} previousAnswers={answers}
                                    onSubmit={this.onSubmit.bind(this)}
                                    onChange={this.onChange.bind(this)}/>
                </Col>
              );

            default:
              return 'Unknown question type';
          }

        case ElementType.QUESTION_REVIEW:
          const reviewQuestion = element.question;
          switch (reviewQuestion.type) {
            case QuestionType.BASIC:
              const basicQuestionModel = QuestionModel.fromJson(reviewQuestion);
              const basicQuestionAnswers = this.state.answers.map(QuestionAnswerModel.fromJson);
              return this.renderWithTopbar(
                <Col className='StretchContent'>
                  <BasicQuestionReview key={`basic-question-review-${basicQuestionModel.id}`}
                                       user={this.props.user}
                                       respondents={this.state.session.currentRespondents}
                                       question={basicQuestionModel}
                                       answers={basicQuestionAnswers}/>
                </Col>
              );
            case QuestionType.REPEATED:
              const repeatedQuestionModel = QuestionModel.fromJson(reviewQuestion);
              const repeatedQuestionAnswers = this.state.answers.map(QuestionAnswerModel.fromJson);
              const previousAnswers = this.state.previousAnswers.map(QuestionAnswerModel.fromJson)
              return this.renderWithTopbar(
                <Col className='StretchContent'>
                  <RepeatedQuestionReview key={`repeated-question-review-${repeatedQuestionModel.id}`}
                                          user={this.props.user}
                                          respondents={this.state.session.currentRespondents}
                                          question={repeatedQuestionModel}
                                          answers={repeatedQuestionAnswers}
                                          previousAnswers={previousAnswers}/>
                </Col>
              );

            default:
              return 'Unknown question type';
          }

        case ElementType.TEXT:
          return this.renderWithTopbar(
            <TextBanner key={`text-banner-${element.number}`}
                        text={element.text}/>
          );

        default:
          return 'Unknown element type';
      }
    } else {
      return null;
    }
  }
}

export default QuestionSession;