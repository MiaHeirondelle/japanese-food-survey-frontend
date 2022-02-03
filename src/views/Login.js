import React, {Component} from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {extractUrlEncodedFormData} from '../util/FormUtil';

import config from '../config.js';
import LoginForm from '../component/LoginForm';

class Login extends Component {
  // Expects `stateTransition` function.

  async login(formData) {
    return await fetch(`${config['backend']['uri']}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
  }

  // todo: remove
  async sessionCheck() {
    const response = await fetch(`${config['backend']['uri']}/auth/test`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.text()
  }

  // todo: after view render check if already logged in

  async stateTransition(formEvent) {
    formEvent.preventDefault();
    formEvent.stopPropagation();
    const form = formEvent.currentTarget;

    if (form.checkValidity() === true) {
      const formValues = extractUrlEncodedFormData(form);
      await this.login(formValues);
      const checkResult = await this.sessionCheck();
      form.reset();
      window.scrollTo(0, 0);
      this.props.stateTransition({checkResult});
    }
  }

  render() {
    return (
      <Row className='FullHeightContent align-items-center'>
        <Col className='col-lg-4 offset-lg-4'>
          <Row>
            <h5>
              IDとパスワードを入力してください<br/>
              記入したら、「次へ」をクリックしてください<br/>
            </h5>
          </Row>
          <Row className='mt-3'>
            <LoginForm formId='user-login' onSubmit={this.stateTransition.bind(this)}/>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default Login;