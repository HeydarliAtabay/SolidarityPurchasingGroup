import { Form, Alert, Button, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import '../App.css';
import '../index.css';
function LoginForm1(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    props.setMessage('');

    const credentials = { username, password };

    let valid = true;
    if (username.trim() === '' || password.trim() === '') valid = false;

    if (valid) {
      props.login(credentials);
    } else {
      props.setMessage('Insert a valid Email and Password and try again');
    }
  };

  const handleClear = () => {
    setUsername('');
    setPassword('');
    props.setMessage('');
  };


  if (props.logged) {
    if (props.userRole === 'client') {
      if (props.users.find(x => x.email === username && x.suspended === 1))
      return <Redirect to="/suspended-client" />;
      else 
      return <Redirect to="/client" />;
    } else if (props.userRole === 'employee') {
      return <Redirect to="/employee" />;
    } else if (props.userRole === 'farmer') {
      return <Redirect to="/farmer" />;
    } else if (props.userRole === 'warehouse-employee') {
      return <Redirect to="/warehouse-employee" />;
    } else if (props.userRole === 'warehouse-manager') {
      return <Redirect to="/warehouse-manager" />;
    } else if (props.userRole === 'delivery-personnel') {
      return <Redirect to="/delivery" />;
    } else if (props.userRole === 'shop-manager') {
      return <Redirect to="/manager" />;
    }
  }

  return (
    <Container fluid="lg">
      <Row className="justify-content-md-center">
        <Col lg={3} />
        <Col lg={6} className="mb-5">
          <span className="d-block text-center mt-5 mb-2 display-2">
            SPG Login
          </span>
          <h5 className="d-block mx-auto mb-5 text-center text-muted">
            Enter your credentials below
          </h5>
          {props.message !== '' && (
            <Alert
              variant="danger"
              className="text-center"
              onClose={() => props.setMessage('')}
              dismissible
            >
              {props.message}
            </Alert>
          )}
          <div className="d-block text-center mb-3">
            Don't have an account yet?{' '}
            <Link to="/registration">Client sign up</Link>
          </div>
          <Form className="mx-auto d-block text-start">
            <Form.Group controlId="username">
              <Form.Label style={{ fontSize: 25 }}>Email</Form.Label>
              <Form.Control
                size="lg"
                type="email"
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="password">
              <Form.Label style={{ fontSize: 25 }}>Password</Form.Label>
              <Form.Control
                size="lg"
                type="password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </Form.Group>
            <br />
            <div className="d-block text-center">
              <Button variant="danger" className="me-3" onClick={handleClear}>
                Clear
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Login
              </Button>
            </div>
          </Form>
          <hr />
          <div className="d-block text-center">
            Want to work with us? <Link to="/farmer-apply">Apply here</Link>
          </div>
        </Col>
        <Col lg={3} />
      </Row>
    </Container>
  );
}

export { LoginForm1 };
