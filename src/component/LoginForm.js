import React, {Component} from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class LoginForm extends Component {
  // Expects formId, disabled, onSubmit function
  render() {
    return (
      <Form id={this.props.formId} onSubmit={this.props.onSubmit}>
        <Form.Group className='mb-3' controlId='login'>
          <Form.Label>Login</Form.Label>
          <Form.Control name='login' type='text' placeholder='ログイン'/>
        </Form.Group>

        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control name='password' type='password' placeholder='パスワード'/>
        </Form.Group>
        <Button className='btn-block' type='submit' disabled={this.props.disabled}>次へ</Button>
      </Form>
    )
  }
}

export default LoginForm;
