import React, {Component} from "react";
import Form from "react-bootstrap/Form";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class RepeatedQuestionForm extends Component {

  // Expects question, formId, disabled, onSubmit function, onChange function
  constructor(props) {
    super(props);
    this.state = {
      timeoutId: undefined
    }
  }

  onChange(formEvent) {
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId);
      this.state.timeoutId = undefined;
    }
    this.setState({timeoutId: setTimeout(() => this.props.onChange(formEvent), 1000)});
  }

  componentWillUnmount() {
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId);
    }
  }

  render() {
    return (
      <Form className='StretchContent' id={this.props.formId} onSubmit={this.props.onSubmit}
            onChange={this.onChange.bind(this)}>
        <Row className='StretchContainer'>
          <Col className='col-lg-12'>
            <Row><h4>質問１</h4></Row>
            <Row>
              <Col className='col-lg-6'>
                <span className='ImportantText'>{this.props.question.text}</span>
              </Col>
              <Col className='col-lg-6'>
                <Row>
                  {
                    Array.from({length: 6}, (_, i) => i).map((i) => {
                      const id = `likert-value-${i}`;
                      return <Col className='col-sm-2 align-content-center' key={id}>
                        <Form.Check label={i}
                                    name='likertValue'
                                    type='radio'
                                    value={i}
                                    id={id}/>
                      </Col>;
                    })
                  }
                </Row>
                <Row>
                  <Col className='col-sm-2 text-left KeepLineBreaks'>
                    {this.props.question.scaleTextLeft.replace(' ', '\n')}
                  </Col>
                  <Col className='col-sm-2 offset-sm-8 text-left KeepLineBreaks'>
                    {this.props.question.scaleTextRight.replace(' ', '\n')}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className='mt-5 StretchContainer'>
          <Col className='col-lg-12'>
            <Row><h4>質問２</h4></Row>
            <Row>
              <Col className='col-lg-6'>
                <span className='ImportantText'>
                  意見が変わった<br/>
                  もしくは変わらなかった理由を教えてください
                </span>
              </Col>
              <Col className='col-lg-6'>
                <Form.Control as='textarea' rows={5} name='userComment' key='user-comment'/>
              </Col>
            </Row>
          </Col>
        </Row>

        {/*<Button className='mb-xl-5 w-100' type='submit' disabled={this.props.disabled}>Submit</Button>*/}
      </Form>
    )
  }
}

export default RepeatedQuestionForm;