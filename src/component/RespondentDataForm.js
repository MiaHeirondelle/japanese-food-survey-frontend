import React, {Component} from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class RespondentDataForm extends Component {

  // Expects formId, disabled, onSubmit function
  render() {
    const sexes = [
      {name: '男性', value: 'male'},
      {name: '女性', value: 'female'}
    ]
    return (
      <Form id={this.props.formId} onSubmit={this.props.onSubmit}>
        <Form.Group className='mb-3' controlId='sex'>
          <Form.Label>性別</Form.Label>
          <Row className='px-3'>
            {
              sexes.map((sex) => {
                const id = `sex-${sex.value}`;
                return <Col className='CenterInlineFormChecks' key={id}>
                  <Form.Check
                    inline
                    label={sex.name}
                    name='sex'
                    type='radio'
                    value={sex.value}
                    id={id}
                  />
                </Col>;
              })
            }
          </Row>
        </Form.Group>

        <Form.Group className='mb-3' controlId='age'>
          <Form.Label>Password</Form.Label>
          <Form.Control name='age' type='number' defaultValue={18} min={1} max={100}/>
        </Form.Group>
        <Button className='btn-block' type='submit' disabled={this.props.disabled}>次へ</Button>
      </Form>
    )
  }
}

export default RespondentDataForm;
