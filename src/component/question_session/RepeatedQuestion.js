import React, {Component} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import QuestionForm from "./QuestionForm";

class RepeatedQuestion extends Component {
  // Expects pageNumber, elementNumber, question, previousQuestion, respondents, previousAnswers, onSubmit, onChange

  render() {
    const previousAnswer = (this.props.previousAnswers.find((a) => a.respondentId === this.props.user.id) || {value: '空欄'}).value
    return <Row className='StretchContainer mt-lg-3 mx-lg-4'>
      <Row>
        <Col className='col-lg-6 ImportantText'>
          意見が変わった<br/>
          もしくは変わらなかった理由を教えてください
        </Col>
      </Row>
      <Row>
        <Col className='col-lg-12 ImportantText'>
          あなたの最初の回答:
        </Col>
      </Row>
      <Row>
        <Col className='col-lg-12 ImportantText'>
          {previousAnswer}
        </Col>
      </Row>
      <QuestionForm key={`repeated-question-form-${this.props.question.id}`}
                    formId={`form-${this.props.question.id}`}
                    question={this.props.question}
                    onSubmit={this.props.onSubmit}
                    onChange={this.props.onChange}/>
    </Row>
  }
}

export default RepeatedQuestion;