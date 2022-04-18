import React, {Component} from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {extractUrlEncodedFormData} from '../util/FormUtil';
import LoginForm from '../component/LoginForm';
import * as client from "../client/client"


class Login extends Component {
  // Expects `stateTransitionCb` function.
  constructor(props) {
    super(props);
    this.state = {
      formDisabled: true
    }
  }

  // todo: after view render check if already logged in
  async componentDidMount() {
    const user = await client.authCheck();
    if (user) {
      this.props.stateTransitionCb({user});
    } else {
      this.setState({formDisabled: false})
    }
  }

  async loginStateTransition(formEvent) {
    formEvent.preventDefault();
    formEvent.stopPropagation();
    const form = formEvent.currentTarget;

    if (form.checkValidity() === true) {
      const formValues = extractUrlEncodedFormData(form);
      const user = await client.login(formValues);
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