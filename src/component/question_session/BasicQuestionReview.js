import React, {Component} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import BasicAnswer from "./BasicAnswer";
import {createAnswersList} from "../../util/AnswerUtil";

class BasicQuestionReview extends Component {
  // Expects 'user', 'respondents', 'question', 'answers'
  constructor(props) {
    super(props);
    this.state = {
      answers: createAnswersList(this.props.user, this.props.respondents, this.props.question, this.props.answers)
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
          <th className='text-center align-middle'>名前</th>
          <th>
            <Col>
              <Row>回答</Row>
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
          <th className='text-center align-middle'>コメント</th>
        </tr>
        </thead>
        <tbody>
        {
          this.state.answers.map((answer, index) =>
            <BasicAnswer key={`answer-${index}`} index={index} respondents={this.props.respondents} answer={answer}/>
          )
        }
        </tbody>
      </Table>
      <Row className='StretchContent'/>
    </Row>
  }
}

export default BasicQuestionReview;