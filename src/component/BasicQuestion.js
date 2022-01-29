import React, {Component} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import QuestionTimer from "./QuestionTimer";
import BasicQuestionForm from "./BasicQuestionForm";

class BasicQuestion extends Component {
  // Expects 'onSubmit, 'pageNumber', 'questionModel'
  constructor(props) {
    super(props);
  }

  render() {
    return <Row className='StretchContainer mt-lg-3 mx-lg-4'>
      <Row>
        <Col className='col-lg-10 '>
          <h4>{this.props.pageNumber}練習:質問{this.props.questionModel.questionNumber}・{this.props.questionModel.questionNumber + 1}の回答</h4>
        </Col>
        <Col className='col-lg-2'>
          <QuestionTimer startFromS={130} intervalS={1}/>
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
      <BasicQuestionForm formId={`form-${this.props.questionModel.questionId}`} questionModel={this.props.questionModel}
                         onSubmit={this.props.onSubmit}/>
    </Row>
  }
}

export default BasicQuestion;