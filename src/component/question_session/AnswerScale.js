import React, {Component} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

class AnswerScale extends Component {
  // Expects 'answerValue', 'respondentId'

  render() {
    return (
      <Row className='px-3'>
        {
          Array.from({length: 6}, (_, i) => i).map((i) => {
            const id = `likert-value-${i}`;
            return <Col className='col-2 CenterInlineFormChecks' key={id}>
              <Form.Check
                inline
                disabled
                label={i}
                defaultChecked={i === this.props.answerValue}
                name={`likertValue-${this.props.respondentId}`}
                type='radio'
                value={i}
                id={id}
              />
            </Col>;
          })
        }
      </Row>
    )
  }
}

export default AnswerScale;