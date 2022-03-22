import React, {Component} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class BasicQuestionForm extends Component {

  // Expects questionModel, formId, disabled, onSubmit function
  render() {
    return (
      <Form className='StretchContent' id={this.props.formId} onSubmit={this.props.onSubmit}>
        <Row className='StretchContainer'>
          <Col className='col-lg-12'>
            <Row><h4>質問１</h4></Row>
            <Row>
              <Col className='col-lg-6'>
                <span className='ImportantText'>{this.props.questionModel.text}</span>
              </Col>
              <Col className='col-lg-6'>
                <Row>
                  {
                    Array.from({length: 6}, (_, i) => i).map((i) => {
                      const id = `likert-value-${i}`;
                      return <Col className='col-sm-2 align-content-center' key={id}><Form.Check required={true}
                                                                                                 label={i}
                                                                                                 name='likertValue'
                                                                                                 type='radio' value={i}
                                                                                                 id={id}/></Col>;
                    })
                  }
                </Row>
                <Row>
                  <Col className='col-sm-2 text-left KeepLineBreaks'>{this.props.questionModel.scaleTextLeft}</Col>
                  <Col className='col-sm-2 offset-sm-8 text-left KeepLineBreaks'>{this.props.questionModel.scaleTextRight}</Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className='mt-5 StretchContainer'>
          <Col className='col-lg-12'>
            <Row><h4>質問2</h4></Row>
            <Row>
              <Col className='col-lg-6'>
                <span className='ImportantText'>その理由を教えてください</span>
              </Col>
              <Col className='col-lg-6'>
                <Form.Control as='textarea' rows={5} name='userComment' key='user-comment'/>
              </Col>
            </Row>
          </Col>
        </Row>

        <Button className='mb-xl-5 w-100' type='submit' disabled={this.props.disabled}>Submit</Button>
      </Form>
    )
  }
}

export default BasicQuestionForm;