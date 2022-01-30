import React, {Component} from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {extractUrlEncodedFormData} from '../util/FormUtil';

import config from '../config.js';
import LoginForm from '../component/LoginForm';

class Login extends Component {
  // Expects `stateTransition` function.

  async login(formData) {
    return await fetch(`${config['backend']['uri']}/user/log-in`, {
      method: 'POST',
      mode: 'no-cors',
      credentials: 'include',
      body: formData
    });
  }

  // todo: before view render check if already logged in

  async stateTransition(formEvent) {
    formEvent.preventDefault();
    formEvent.stopPropagation();
    const form = formEvent.currentTarget;

    if (form.checkValidity() === true) {
      const formValues = extractUrlEncodedFormData(form);
      await this.login(formValues);
      form.reset();
      window.scrollTo(0, 0);
      this.props.stateTransition({});
    }
  }

  render() {
    return (
      <Row className ='FullHeightContent align-items-center'>
        <h5>
          <br/>
          <br/>
          IDとパスワードを入力してください<br/>
          記入したら、「次へ」をクリックしてください<br/>
        </h5>
        <Col className='col-lg-4 offset-lg-4'>
          <LoginForm formId='user-login' onSubmit={this.stateTransition.bind(this)}/>
        </Col>
      </Row>
    );
  }
}

export default Login;