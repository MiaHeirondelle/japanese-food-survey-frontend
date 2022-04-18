import React, {Component} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

class BasicAnswer extends Component {
  // Expects 'respondents', 'answer'

  render() {
    const userName = (this.props.respondents.find(u => u.id === this.props.answer.respondentId) || {name: 'unknown'}).name;
    return <tr>
      <td className='text-center'>
        <h4>{userName}</h4>
      </td>
      <td>
        <Row className='px-3'>
          {
            Array.from({length: 6}, (_, i) => i).map((i) => {
              const id = `likert-value-${i}`;
              return <Col className='col-2 CenterInlineFormChecks' key={id}>
                <Form.Check
                  inline
                  disabled
                  label={i}
                  defaultChecked={i === this.props.answer.value}
                  name={`likertValue-${this.props.answer.respondentId}`}
                  type='radio'
                  value={i}
                  id={id}
                />
              </Col>;
            })
          }
        </Row>
      </td>
      <td>
        {this.props.answer.comment}
      </td>
    </tr>
  }
}

export default BasicAnswer;