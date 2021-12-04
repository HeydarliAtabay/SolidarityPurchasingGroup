import { Form, Alert, ToggleButtonGroup, ToggleButton, Container, Row } from 'react-bootstrap';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

function LoginForm1(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');

        const credentials = { username, password };

        let valid = true;
        if (username.trim() === '' || password.trim() === '')
            valid = false;

        if (valid) {
            props.login(credentials);
        }
        else {
            setErrorMessage('Insert Password and/or Email ')
        }
    };

    if (props.logged) {
        if (props.userRole === 'client') {
            return (
                <Redirect to="/client" />
            );
        }
        else if (props.userRole === 'employee') {
            return (
                <Redirect to="/employee" />
            );
        }
        else if (props.userRole === 'farmer') {
            return (
                <Redirect to="/farmer" />
            );
        }
        else if (props.userRole === 'warehouse-employee') {
            return (
                <Redirect to="/warehouse-employee" />
            );
        }
        else if (props.userRole === 'warehouse-manager') {
            return (
                <Redirect to="/warehouse-manager" />
            );
        }
    }

    return (
        <Container fluid="sx" className="mt-5">
            <Row className="justify-content-md-center">
                <Form className="ml-auto mr-auto d-lg-block" style={{ width: '450px', height: '50px' }}>
                    {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : <></>}

                    <Form.Group controlId='username'>
                        <Form.Label style={{ 'fontSize': 25 }}>Email</Form.Label>
                        <Form.Control size="lg" type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
                    </Form.Group>
                    <br />
                    <Form.Group controlId='password'>
                        <Form.Label style={{ 'fontSize': 25 }}>Password</Form.Label>
                        <Form.Control size="lg" type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                    </Form.Group>
                    <br />
                    <ToggleButtonGroup type="checkbox" >
                        <ToggleButton variant='primary' style={{ 'fontSize': 25 }} onClick={handleSubmit}>Login</ToggleButton>
                    </ToggleButtonGroup>
                </Form>
            </Row>
        </Container>
    );
}


export { LoginForm1 };
