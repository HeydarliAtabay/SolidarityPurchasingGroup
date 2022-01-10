import { React, useEffect, useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { Country, State } from 'country-state-city';
import API from '../API';

function UserRegistration(props) {
  const history = useHistory();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState(1);
  const [date, setDate] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [address, setAdress] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const [passwordEqual, setPasswordEqual] = useState(0);

  const [register, setRegister] = useState(false);

  let j, v;
  if (props.users.length === 0) v = 1;
  else {
    j = props.users.map((x) => x.id);
    v = Math.max(...j) + 1;
  }
  const okayStyle = { color: 'green' };
  const noStyle = { color: 'red' };

  useEffect(() => {
    if (!register) {
      return;
    }

    const signup = async () => {
      try {
        const newClient = Object.assign(
          {},
          {
            budget: 0.0,
            name: name,
            surname: surname,
            gender: gender,
            birthdate: date,
            country: country,
            region: region,
            address: address,
            city: city,
            phone: phone,
            email: email,
            hash: password1,
          }
        );
        const newUser = {
          id: v,
          name: name,
          email: email,
          hash: password1,
          role: 'client',
          suspended: 0,
          date_suspension: null,
        };

        await API.addClient(newClient);
        await API.addUser(newUser);
        props.setRecharged(true);
        props.setRecharged1(true);
        if (props.userRole === 'employee') {
          history.push('/employee');
          props.setAuthAlert({ variant: 'success', msg: <>The client account was successfully created!</> });
        }
        else {
          history.push('/');
          props.setAuthAlert({ variant: 'success', msg: <>Your account was successfully created!<br />You can now login using the details provided in the registration form</> });
        }
      } catch (error) {
        console.log(error);
        props.setAuthAlert({ variant: 'danger', msg: <>Oops! Something went wrong.<br />Please double check the provided information and try again</> });
      }
      setRegister(false);
    }

    signup();

  }, [register])

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setRegister(true);
  };

  return (
    <>
      <div className="d-block mx-auto my-5 w-75">
        <div className="d-block text-center border border-secondary rounded-3 shadow w-100">
          <span className="d-block text-center mt-3 mb-5 display-2">
            Create account
          </span>
          <Form onSubmit={handleSubmit} className="m-3">
            {/*Personal information*/}
            <Row>
              <div className="col-md-4">
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="type your name..."
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group controlId="formSurname">
                  <Form.Label>Surname</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="type your surname..."
                    value={surname}
                    onChange={(ev) => setSurname(ev.target.value)}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-2">
                <Form.Label>Male</Form.Label>
                <Form.Group className="mb-3" id="formGridCheckbox">
                  <Form.Check
                    type="checkbox"
                    checked={gender}
                    onChange={(ev) => {
                      if (gender) setGender(0);
                      else setGender(1);
                    }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-2">
                <Form.Label>Female</Form.Label>
                <Form.Group className="mb-3" id="formGridCheckbox">
                  <Form.Check
                    type="checkbox"
                    checked={!gender}
                    onChange={(ev) => {
                      if (gender) setGender(0);
                      else setGender(1);
                    }}
                  />
                </Form.Group>
              </div>
            </Row>
            {/*Information about birth*/}
            <Row>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="type your name..."
                    value={date}
                    onChange={(ev) => {
                      setDate(ev.target.value);
                    }}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="formSurname">
                  <Form.Label>Country of Birth</Form.Label>
                  <Form.Control placeholder="Please write your country of birth" />
                </Form.Group>
              </div>
            </Row>
            <Row>{/*Contact information*/}</Row>

            <Row className="mb-3">
              <div className="col-md-6">
                <Form.Group controlId="formGridEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(ev) => {
                      setEmail(ev.target.value);
                    }}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formGridEmail">
                  <Form.Label>Phone</Form.Label>
                  <PhoneInput
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={setPhone}
                  />
                </Form.Group>
              </div>
            </Row>
            <Row className="mb-3">
              <h5>Residence address</h5>
              <div className="col-md-6">
                <Form.Select
                  size="lg"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                >
                  <option value="-1">Country</option>
                  {Country.getAllCountries().map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-md-6">
                <Form.Select
                  size="lg"
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                >
                  <option value="-1">Region</option>
                  {country !== -1 &&
                    State.getStatesOfCountry(country).map((r) => (
                      <option key={r.isoCode} value={r.isoCode}>
                        {r.name}
                      </option>
                    ))}
                </Form.Select>
              </div>
            </Row>
            <Row>
              <h5> </h5>
              <Col>
                <Form.Group className="mb-3" controlId="formAdress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    placeholder="1234 Main St"
                    value={address}
                    onChange={(ev) => {
                      setAdress(ev.target.value);
                    }}
                  />
                </Form.Group>
              </Col>

              <Col>
                {' '}
                <Form.Group className="mb-3" controlId="formCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    placeholder="City"
                    value={city}
                    onChange={(ev) => {
                      setCity(ev.target.value);
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/*Password details*/}

            <Row>
              <Col>
                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group as={Col} controlId="formGridPassword1">
                  <Form.Label>Repeat password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password1}
                    onChange={(ev) => {
                      setPassword1(ev.target.value);
                      if (password === ev.target.value) {
                        setPasswordEqual(1);
                      }
                      if (password !== ev.target.value) {
                        setPasswordEqual(0);
                      }
                    }}
                    required
                  />
                </Form.Group>
              </Col>
              {password1 !== '' && passwordEqual === 0 && (
                <span style={noStyle}>passwords are not equal</span>
              )}
              {password1 !== '' && passwordEqual === 1 && (
                <span style={okayStyle}>passwords are equal</span>
              )}
            </Row>

            <div className="subBtn">
              <Button
                variant="danger"
                type="submit"
                size="lg"
                className="me-2"
                onClick={(event) => {
                  history.push('/employee');
                }}
              >
                Cancel & Go back
              </Button>
              <Button variant="primary" type="submit" size="lg">
                Create account
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default UserRegistration;
