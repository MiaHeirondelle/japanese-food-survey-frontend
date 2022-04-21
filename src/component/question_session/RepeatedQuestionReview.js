import React, {Component} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import RepeatedAnswer from "./RepeatedAnswer";
import {createAnswersList} from "../../util/AnswerUtil";

class RepeatedQuestionReview extends Component {
  // Expects 'user', 'respondents', 'question', 'answers', 'previousAnswers'
  constructor(props) {
    super(props);
    const baseAnswers = createAnswersList(this.props.user, this.props.respondents, this.props.question, this.props.answers);
    const previousAnswers = createAnswersList(this.props.user, this.props.respondents, this.props.question, this.props.previousAnswers);

    this.state = {
      // zip
      answers: baseAnswers.map((v, i) => [v, previousAnswers[i]])
    }
  }

  render() {
    return <Row className='StretchContainer mt-lg-3 mx-lg-4'>
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
          <th>
            <Col>
              <Row>Previous Answer</Row>
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
          <th className='text-center align-middle'>Previous comment</th>
        </tr>
        </thead>
        <tbody>
        {
          this.state.answers.map(([answer, previousAnswer], index) =>
            <RepeatedAnswer key={`answer-${index}`} respondents={this.props.respondents} answer={answer}
                            previousAnswer={previousAnswer}/>
          )
        }
        </tbody>
      </Table>
      <Row className='StretchContent'/>
    </Row>
  }
}

export default RepeatedQuestionReview;