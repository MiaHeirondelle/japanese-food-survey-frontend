import React, {Component} from 'react'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as client from "../client/client";
import {extractUrlEncodedFormData} from "../util/FormUtil";
import RespondentDataForm from "../component/RespondentDataForm";

class RespondentData extends Component {

  // Expects `stateTransitionCb` function.
  async respondentDataStateTransition(formEvent) {
    formEvent.preventDefault();
    formEvent.stopPropagation();
    const form = formEvent.currentTarget;

    if (form.checkValidity() === true) {
      const formValues = extractUrlEncodedFormData(form);
      await client.submitRespondentData(formValues);
      form.reset();
      window.scrollTo(0, 0);
      this.props.stateTransitionCb();
    }
  }

  render() {
    return (
      <Row className='FullHeightContent align-items-center'>
        <Col className='col-lg-4 offset-lg-4'>
          <Row>
            <h5>
              個人情報を入力してください<br/>
              記入したら、「次へ」をクリックしてください<br/>
            </h5>
          </Row>
          <Row className='mt-3'>
            <RespondentDataForm formId='respondent-data' onSubmit={this.respondentDataStateTransition.bind(this)}/>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default RespondentData;
