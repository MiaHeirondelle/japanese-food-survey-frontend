import React, {Component} from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {extractUrlEncodedFormData} from '../util/FormUtil';

import config from '../config.js';
import LoginForm from '../component/LoginForm';
import User from "../model/user/User";

class Login extends Component {
  // Expects `stateTransitionCb` function.
  constructor(props) {
    super(props);
    this.state = {
      formDisabled: true
    }
  }

  async login(formData) {
    const response = await fetch(`${config['backend']['uri']}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    const userJson = await response.json();
    return new User(userJson.user, userJson.name, userJson.role);
  }

  async componentDidMount() {
    const response = await fetch(`${config['backend']['uri']}/auth/check`, {
      method: 'GET',
      credentials: 'include'
    });
    if (response.ok) {
      const userJson = await response.json();
      const user = new User(userJson.user, userJson.name, userJson.role);
      this.props.stateTransitionCb({user});
    } else {
      this.setState({formDisabled: false})
    }
  }

  // todo: after view render check if already logged in

  async loginStateTransition(formEvent) {
    formEvent.preventDefault();
    formEvent.stopPropagation();
    const form = formEvent.currentTarget;

    if (form.checkValidity() === true) {
      const formValues = extractUrlEncodedFormData(form);
      const user = await this.login(formValues);
      form.reset();
      window.scrollTo(0, 0);
      this.props.stateTransitionCb({user});
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
            <LoginForm formId='user-login' disabled={this.state.formDisabled}
                       onSubmit={this.loginStateTransition.bind(this)}/>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default Login;