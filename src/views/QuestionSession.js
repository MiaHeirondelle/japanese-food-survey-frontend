import React, {Component} from "react";
import {QuestionType} from "../model/session/QuestionType";
import BasicQuestion from "../component/question_session/BasicQuestion";
import BasicQuestionModel from "../model/question/BasicQuestionModel";
import {extractFormData} from "../util/FormUtil";
import ScreenCutoffBar from "../component/ScreenCutoffBar";
import Col from "react-bootstrap/Col";
import {ElementType} from "../model/session/ElementType";
import User from "../model/user/User";
import {displayInfoPopup} from "../util/PopupUtil";
import * as websocketClient from "../client/websocket";

class QuestionSession extends Component {

  // Expects: `user` `socket` `session`, `sessionFinishedCb`
  // State: session
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
        case 'element_selected':
          self.setState((previousState) => {
            return {...previousState, element: message.element}
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
          const question = element.question;
          switch (question.type) {
            case QuestionType.BASIC:
              const questionModel = BasicQuestionModel.fromJson(question);
              return (
                <Col className='FullHeightContent StretchContent'>
                  <ScreenCutoffBar/>
                  <BasicQuestion pageNumber={0} ref={this.elementRef} questionModel={questionModel} elementNumber={element.number}
                                 onSubmit={this.onSubmit.bind(this)} onTimeoutCb={this.onTimeout.bind(this)}/>
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

  onTimeout() {
    // todo: remove hack
    websocketClient.sendReadyForNextElement(this.state.socket);
  }
}

export default QuestionSession;