import React, {Component} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import RepeatedQuestionForm from "./RepeatedQuestionForm";
import AnswerScale from "./AnswerScale";

class RepeatedQuestion extends Component {
  // Expects user, pageNumber, elementNumber, question, previousQuestion, respondents, previousAnswers, onSubmit, onChange

  render() {
    const previousAnswer = (this.props.previousAnswers.find((a) => a.respondentId === this.props.user.id) || {value: '空欄'}).value
    return <Row className='StretchContainer mt-lg-3 mx-lg-4'>
      <Row>
        <Col className='col-lg-6 ImportantText'>
          以下の質問に対して回答していただきます<br/>
          あてはまるボタンをクリックして、理由を記入してください<br/>
          右上の残り時間が「０」になると自動的に次のページに進みますので<br/>
          それまでに選択と記入をお願いします<br/>
          それではどうぞ！
        </Col>
      </Row>
      <Row>
        <Col className='col-lg-12 ImportantText'>
          あなたの最初の回答:
        </Col>
      </Row>
      <Row>
        <Col className='col-lg-4 ImportantText'>
          <AnswerScale answerValue={previousAnswer} respondentId={this.props.user.id}/>
        </Col>
      </Row>
      <RepeatedQuestionForm key={`repeated-question-form-${this.props.question.id}`}
                            formId={`form-${this.props.question.id}`}
                            question={this.props.question}
                            onSubmit={this.props.onSubmit}
                            onChange={this.props.onChange}/>
    </Row>
  }
}

export default RepeatedQuestion;