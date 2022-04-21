import React, {Component} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import QuestionTimer from "./QuestionTimer";
import BasicQuestionForm from "./BasicQuestionForm";

class RepeatedQuestion extends Component {
  // Expects onSubmit, pageNumber, elementNumber, question, previousQuestion, respondents, previousAnswers
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      currentTimeS: 0
    }
  }

  render() {
    console.log(this.props.previousAnswers);
    const previousAnswer = (this.props.previousAnswers.find((a) => a.respondentId === this.props.user.id) || { value: 'empty' }).value
    console.log(previousAnswer);
    return <Row className='StretchContainer mt-lg-3 mx-lg-4'>
      <Row>
        <Col className='col-lg-10 '>
          <h4>{this.props.pageNumber}練習:質問{this.props.elementNumber}・{this.props.elementNumber + 1}の回答</h4>
        </Col>
        <Col className='col-lg-2'>
          <QuestionTimer currentTimeS={this.state.currentTimeS}/>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col className='col-lg-6 ImportantText'>
          以下の質問に対して回答していただきます<br/>
          あてはまるボタンをクリックして、理由を記入してください<br/>
          右上の残り時間が「０」になると自動的に次のページに進みますので<br/>
          それまでに選択と記入をお願いします<br/>
          それではどうぞ！
        </Col>
      </Row>
      <Row className='ImportantText'>
        <Col className='col-lg-12 ImportantText'>
          You previously answered the following question:
        </Col>
      </Row>
      <Row>
        <Col className='col-lg-12 ImportantText'>
          {this.props.previousQuestion.text}
        </Col>
      </Row>
      <Row>
        <Col className='col-lg-12 ImportantText'>
          Your answer was:
        </Col>
      </Row>
      <Row>
        <Col className='col-lg-12 ImportantText'>
          {previousAnswer}
        </Col>
      </Row>
      <BasicQuestionForm ref={this.formRef} formId={`form-${this.props.question.id}`}
                         question={this.props.question}
                         onSubmit={this.props.onSubmit}/>
    </Row>
  }

  setTime(timeS) {
    this.setState({currentTimeS: timeS});
  }

  getForm() {
    return this.formRef.current.getForm();
  }
}

export default RepeatedQuestion;