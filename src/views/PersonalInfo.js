import React, {Component} from 'react'
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class PersonalInfo extends Component {

// Expects `stateTransition` function.
    render() {
        return (
            <div className="col-lg">
                <Col className='col-lg-10'><h4>002:アンケート</h4></Col>
                    <Row>
                        <Col className='col-lg-5'>
                        <h5><br/>
                        最初に以下にご回答ください<br/>
                        記入したら、「次へ」クリックしてください<br/><br/>
                        </h5></Col>
                    </Row>
                <Row><h4>年齢</h4></Row>
                <Col className='col-lg-2'>
                    <Form.Control as='textarea' rows={1} name='userComment' key='user-comment'/><br/>
                </Col>
                <Row><h4>性別</h4></Row>
                    <input type="radio" value="Male" name="gender" /> 男性
                    <br/>
                    <input type="radio" value="Female" name="gender" /> 女性
                    <br/>
                    <input type="radio" value="Other" name="gender" /> その他
                    <br/>
                    <input type="radio" value="NotAnswered" name="gender" /> 回答しない
                    <br/>
            </div>
        );
    }
}

export default PersonalInfo;
