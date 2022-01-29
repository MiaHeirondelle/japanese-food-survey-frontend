import React, {Component} from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class PersonalInfoForm extends Component {
    // Expects formId, disabled, onSubmit function
    render() {
        return (
            <Form id={this.props.formId} onSubmit={this.props.onSubmit}>
                <Form.Group className='mb-3' controlId='login'>
                    <Form.Label>Login</Form.Label>
                    <Form.Control name='login' type='text' placeholder='Enter login' />
                </Form.Group>

                <Form.Group className='mb-3' controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control name='password' type='password' placeholder='Password' />
                </Form.Group>
                <br/>
                <Button type='submit' disabled={this.props.disabled}>Submit</Button>
            </Form>
        )
    }
}

export default PersonalInfoForm;
