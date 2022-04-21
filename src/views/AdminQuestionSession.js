import React, {Component} from "react";
import {QuestionType} from "../model/session/QuestionType";
import QuestionModel from "../model/question/QuestionModel";
import ScreenCutoffBar from "../component/ScreenCutoffBar";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {ElementType} from "../model/session/ElementType";
import User from "../model/user/User";
import {displayInfoPopup} from "../util/PopupUtil";
import QuestionAnswerModel from "../model/question/QuestionAnswerModel";
import BasicQuestionReview from "../component/question_session/BasicQuestionReview";
import QuestionTimer from "../component/question_session/QuestionTimer";
import * as websocketClient from "../client/websocket";

class AdminQuestionSession extends Component {

  // Expects: user, socket, session, sessionFinishedCb`
  // State: session, socket, element
  constructor(props) {
    super(props);
    this.state = {
      session: this.props.session,
      socket: this.props.socket,
      currentTimeS: 0,
      element: undefined
    }
    const self = this;
    this.props.socket.onmessage = async function (event) {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'basic_question_selected':
        case 'repeated_question_selected':
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
            displayInfoPopup(`ユーザー[${user.name}]がジョインされました`)
          }
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

  renderWithTopbar(component) {
    const elementNumber = this.state.element ? this.state.element.number : 0;
    const elementLimit = this.state.session.template.elements.length;
    return (
      <Col className='FullHeightContent StretchContent'>
        <ScreenCutoffBar/>
        <Row className='mt-lg-3 mx-lg-4'>
          <Col className='col-lg-10'>
            <h4>画面{elementNumber}/{elementLimit}</h4>
          </Col>
          <Col className='col-lg-2'>
            <QuestionTimer currentTimeS={this.state.currentTimeS}/>
          </Col>
        </Row>
        <br/>
        {component}
        <ScreenCutoffBar/>
      </Col>
    );
  }

  async componentDidMount() {
    websocketClient.sendReadyToProceed(this.state.socket);
  }

  render() {
    const element = this.state.element;
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
              const questionModel = QuestionModel.fromJson(reviewQuestion);
              const answers = this.state.answers.map(QuestionAnswerModel.fromJson);
              return this.renderWithTopbar(
                <Col className='StretchContent'>
                  <BasicQuestionReview user={this.props.user}
                                       respondents={this.state.session.currentRespondents}
                                       question={questionModel}
                                       answers={answers}/>
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