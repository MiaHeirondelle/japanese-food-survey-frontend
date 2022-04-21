import React, {Component} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import BasicAnswer from "./BasicAnswer";
import QuestionTimer from "./QuestionTimer";
import QuestionAnswerModel from "../../model/question/QuestionAnswerModel";

class BasicQuestionReview extends Component {
  // Expects 'pageNumber', 'elementNumber', 'user', 'respondents', 'question', 'answers'
  constructor(props) {
    super(props);
    const userAnswerIndex = this.props.answers.findIndex(a => a.respondentId === this.props.user.id);
    const userAnswer = userAnswerIndex >= 0 ? [this.props.answers[userAnswerIndex]] : [];
    const otherAnswers = this.props.answers.slice();
    if (userAnswerIndex >= 0) {
      otherAnswers.splice(userAnswerIndex, 1);
    }
    const missingAnswers = this.props.respondents
      .filter((r) => this.props.answers.findIndex((a) => a.respondentId === r.id) < 0)
      .map((r) => new QuestionAnswerModel(this.props.question.id, r.id, null, null));
    otherAnswers.push(...missingAnswers);

    otherAnswers
      .sort((a1, a2) => {
        const u1Name = (this.props.respondents.find((r) => r.id === a1.respondentId) || {name: 'undefined'}).name;
        const u2Name = (this.props.respondents.find((r) => r.id === a2.respondentId) || {name: 'undefined'}).name;
        return u1Name.localeCompare(u2Name);
      });

    this.state = {
      currentTimeS: 0,
      answers: userAnswer.concat(otherAnswers)
    }
  }

  render() {
    return <Row className='StretchContainer mt-lg-3 mx-lg-4'>
      <Row>
        <Col className='col-lg-10'>
          <h4>{this.props.pageNumber}練習:質問{this.props.elementNumber}・{this.props.elementNumber + 1}の回答</h4>
        </Col>
        <Col className='col-lg-2'>
          <QuestionTimer currentTimeS={this.state.currentTimeS}/>
        </Col>
      </Row>
      <Row className='ImportantText'>
        {this.props.question.text}
      </Row>
      <Table striped bordered hover>
        <thead>
        <tr>
          <th className='text-center align-middle'>Name</th>
          <th>
            <Col>
              <Row>Answer</Row>
              <Row>
                <Col className='text-start'>
                  {this.props.question.scaleTextLeft}
                </Col>
                <Col className='text-end'>
                  {this.props.question.scaleTextRight}
                </Col>
              </Row>
            </Col>
          </th>
          <th className='text-center align-middle'>Comment</th>
        </tr>
        </thead>
        <tbody>
        {
          this.state.answers.map((answer, index) =>
            <BasicAnswer key={`answer-${index}`} respondents={this.props.respondents} answer={answer}/>
          )
        }
        </tbody>
      </Table>
      <Row className='StretchContent'/>
    </Row>
  }

  setTime(timeS) {
    this.setState((previousState) => {
      return {...previousState, currentTimeS: timeS}
    });
  }
}

export default BasicQuestionReview;