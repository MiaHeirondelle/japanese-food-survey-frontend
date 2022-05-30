import React, {Component} from "react";
import {QuestionType} from "../model/session/QuestionType";
import QuestionModel from "../model/question/QuestionModel";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import {ElementType} from "../model/session/ElementType";
import User from "../model/user/User";
import {displayInfoPopup} from "../util/PopupUtil";
import QuestionAnswerModel from "../model/question/QuestionAnswerModel";
import BasicQuestionReview from "../component/question_session/BasicQuestionReview";
import QuestionTimer from "../component/question_session/QuestionTimer";
import * as client from "../client/client"
import * as websocketClient from "../client/websocket";
import RepeatedQuestionReview from "../component/question_session/RepeatedQuestionReview";
import SessionPaused from "../component/question_session/SessionPaused";

class AdminQuestionSession extends Component {

  // Expects: user, socket, session, sessionFinishedCb`
  // State: session, socket, element
  constructor(props) {
    super(props);
    this.state = {
      session: this.props.session,
      socket: this.props.socket,
      currentTimeS: 0,
      element: undefined,
      paused: false,
      showStopSessionModal: false
    }
    const self = this;
    this.props.socket.onmessage = async function (event) {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'basic_question_selected':
        case 'repeated_question_selected':
          self.setState((previousState) => {
            return {...previousState, element: message.element, paused: false}
          });
          break;
        case 'basic_question_review_selected':
          self.setState((previousState) => {
            return {...previousState, element: message.element, answers: message.answers, paused: false}
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
            return {...previousState, element: message.element, paused: false}
          });
          break;
        case 'session_paused':
          self.setState((previousState) => {
            return {...previousState, paused: true}
          });
          break;
        case 'user_joined':
          const user = User.fromJson(message.user);
          if (user.id !== self.props.user.id) {
            displayInfoPopup(`ユーザー[${user.name}]がジョインされました`)
          }
          break;
        case 'session_finished':
          self.state.socket.onClose = undefined;
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
        <Row className='col-lg-12 mt-3'>
          <Col className='text-center'>
            <Button className='col-lg-10 btn-warning'
                    onClick={this.onPauseClick.bind(this)}>{this.state.paused ? '再開' : '途切'}</Button>
          </Col>
          <Col className='text-center'>
            {this.renderStopSessionModal()}
            <Button className='col-lg-10 btn-danger' onClick={this.onOpenStopSessionModalClick.bind(this)}>停止</Button>
          </Col>
        </Row>
        <br/>
        {component}
      </Col>
    );
  }

  async componentDidMount() {
    websocketClient.readyToProceed(this.state.socket);
  }

  async onPauseClick() {
    if (this.state.paused)
      websocketClient.resumeSession(this.state.socket);
    else
      websocketClient.pauseSession(this.state.socket);
  }

  async onStopSessionClick() {
    await client.stopSession();
    this.state.socket.onClose = undefined;
    this.state.socket.close();
    this.props.sessionFinishedCb();
  }

  onCloseStopSessionModalClick() {
    this.setState((previousState) => {
      return {...previousState, showStopSessionModal: false}
    });
  }

  onOpenStopSessionModalClick() {
    this.setState((previousState) => {
      return {...previousState, showStopSessionModal: true}
    });
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
          return this.renderWithTopbar(
            <Col className='StretchContent'>
              <Row className='StretchContainer align-middle align-items-center text-center '>
                <Col>
                  ユーザー回答待ち
                </Col>
              </Row>
              <Row className='StretchContent'/>
            </Col>
          );

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
            <Col className='StretchContent'>
              <Row className='StretchContainer align-middle align-items-center text-center '>
                <Col>
                  ユーザーテキスト待ち
                </Col>
              </Row>
              <Row className='StretchContent'/>
            </Col>
          );

        default:
          return 'Unknown element type';
      }
    } else {
      return null;
    }
  }

  // https://react-bootstrap.github.io/components/modal/
  renderStopSessionModal() {
    return (
      <Modal show={this.state.showStopSessionModal} onHide={this.onCloseStopSessionModalClick.bind(this)}>
        <Modal.Header closeButton/>
        <Modal.Body>セッションを停止しますか？</Modal.Body>
        <Modal.Footer>
          <Button className="btn-secondary" onClick={this.onCloseStopSessionModalClick.bind(this)}>閉じる</Button>
          <Button className="btn-danger" onClick={this.onStopSessionClick.bind(this)}>停止</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AdminQuestionSession;