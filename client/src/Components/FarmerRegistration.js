import { React, useEffect, useState } from 'react'
import { Button, Form, Row, FloatingLabel, Spinner, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import { Country, State, City } from 'country-state-city';
import API from '../API'
import dayjs from 'dayjs'

function FarmerRegistration(props) {

  const [sendApplication, setSendApplication] = useState(false);
  const [applicationSent, setApplicationSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [country, setCountry] = useState(-1)
  const [region, setRegion] = useState(-1)
  const [city, setCity] = useState(-1)
  const [address, setAddress] = useState("")
  const [zip, setZip] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [description, setDescription] = useState("");

  const [nameError, setNameError] = useState("")
  const [surnameError, setSurnameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [countryError, setCountryError] = useState("")
  const [regionError, setRegionError] = useState("")
  const [cityError, setCityError] = useState("")
  const [addressError, setAddressError] = useState("")
  const [zipError, setZipError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordConfirmError, setPasswordConfirmError] = useState("")

  const [sendApplicationError, setSendApplicationError] = useState("");

  useEffect(() => {
    if (!sendApplication) {
      return;
    }
    const send = async () => {
      try {
        setLoading(true);
        setSendApplication(false);

        const emailUnavailable = await API.checkEmailAvailability(email);
        console.log(emailUnavailable);
        if (emailUnavailable) {
          setEmailError("This email has already been registered. Please use another email address.");
          setLoading(false);
          setApplicationSent(false);
          return;
        }

        const application = {
          name: name,
          surname: surname,
          email: email,
          phone: phone,
          country: Country.getCountryByCode(country).name,
          region: State.getStateByCodeAndCountry(region, country).name,
          city: city,
          address: address,
          zip: zip,
          password: password,
          description: description,
          submit_date: dayjs(props.time.date + ' ' + props.time.hour).format("MM-DD-YYYY HH:mm")
        }

        console.log(application);

        const applicationStatus = await API.sendFarmerApplication(application);
        console.log(applicationStatus);
        if (!applicationStatus) {
          setSendApplicationError("Failed to send your application. Check the filled in data and please try again.");
          setLoading(false);
          setApplicationSent(false);
          return;
        }

        setLoading(false);
        setApplicationSent(true);
      }
      catch (err) {
        console.log(err);
        setLoading(false);
        setApplicationSent(false);
        setSendApplicationError("Failed to send your application. Check the filled in data and please try again.");
      }
    }
    send();
  }, [sendApplication])

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    let errorFlag = false;
    if (name.trim() === "") {
      setNameError("• Please fill in your name");
      errorFlag = true;
    }
    if (surname.trim() === "") {
      setSurnameError("• Please fill in your surname");
      errorFlag = true;
    }
    if (email.trim() === "") {
      setEmailError("• Please fill in your email");
      errorFlag = true;
    }
    if (phone.trim() === "") {
      setPhoneError("• Please fill in your phone number");
      errorFlag = true;
    }
    if (password.trim() === "") {
      setPasswordError("• Please fill in your your password");
      errorFlag = true;
    }
    if (passwordConfirm.trim() !== password.trim()) {
      setPasswordConfirmError("Passwords do not match");
      errorFlag = true;
    }
    if (country === -1) {
      setCountryError("• Please select your country");
      errorFlag = true;
    }
    if (region === -1) {
      setRegionError("• Please select your region");
      errorFlag = true;
    }
    if (city === -1) {
      setCityError("• Please select your city");
      errorFlag = true;
    }
    if (address.trim() === "") {
      setAddressError("• Please fill in your address");
      errorFlag = true;
    }
    if (zip.trim() === "") {
      setZipError("• Please fill in your zip code");
      errorFlag = true;
    }

    setDescription((descr) => (descr.trim()));

    if (!errorFlag) {
      setNameError("");
      setSurnameError("");
      setEmailError("");
      setPhoneError("");
      setCountryError("");
      setRegionError("");
      setCityError("");
      setAddressError("");
      setZipError("");
      setPasswordError("");
      setPasswordConfirmError("");
      setSendApplicationError("");
      setSendApplication(true);
    }

  }

  const handleClear = () => {
    setName("");
    setSurname("");
    setEmail("");
    setPhone("");
    setDescription("");
    setCountry("");
    setRegion("");
    setCity("");
    setAddress("");
    setZip("");
    setPassword("");
    setPasswordConfirm("");
  }



  return (
    <>

      <div className="d-block mx-auto my-5 w-75">
        {loading && <div className='d-block text-center'><Spinner animation="grow" /></div>}
        {!loading && applicationSent &&
          <Alert show={true} variant="success">
            <Alert.Heading>Application status</Alert.Heading>
            <p>
              Your application has successfully been recorded!
              <br />
              One of our managers will review your application as soon as possible and will let you know of the result.
              <br />
              After your application has been accepted you can login with your email and password in the Farmer Area.
            </p>
            <hr />
            <div className="d-flex justify-content-end">
              <Link to="/">
                <Button variant="outline-light">Back to Homepage</Button>
              </Link>
            </div>
          </Alert>
        }
        {!loading && !applicationSent && <>
          <div className="d-block text-center border border-secondary rounded-3 shadow w-100">
            <span className="d-block text-center mt-3 mb-5 display-2">Farmer application form</span>
            <Form onSubmit={(event) => handleSubmit(event)} className="m-3">
              {/*Personal information*/}
              <h4 className="text-start mb-3">Your data</h4>
              <Row>
                <div className="col-md-6">
                  <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
                    <Form.Control type="text" placeholder="Type your name here" value={name} onChange={(event) => (setName(event.target.value))} />
                  </FloatingLabel>
                </div>
                <div className="col-md-6">
                  <FloatingLabel controlId="floatingInput" label="Surname" className="mb-3">
                    <Form.Control type="text" placeholder="Type your surname here" value={surname} onChange={(event) => (setSurname(event.target.value))} />
                  </FloatingLabel>
                </div>
              </Row>
              {/*Contact information*/}
              <Row>
                <div className="col-md-6">
                  <FloatingLabel controlId="floatingInput" label="Email" className="mb-3">
                    <Form.Control type="text" placeholder="Type your email here" value={email} onChange={(event) => (setEmail(event.target.value))} />
                  </FloatingLabel>
                </div>
                <div className="col-md-6">
                  <PhoneInput
                    containerClass="mb-3"
                    inputClass="w-100 rounded"
                    inputStyle={{ height: "99%" }}
                    placeholder="Phone number"
                    value={phone}
                    onChange={(formattedValue) => (setPhone(formattedValue))}
                  />
                </div>
              </Row>
              {/*Password information*/}
              <Row className="mb-3">
                <div className="col-md-6">
                  <FloatingLabel controlId="floatingInput" label="Password" className="mb-3">
                    <Form.Control type="password" value={password} placeholder="Type your password here" onChange={(event) => (setPassword(event.target.value))} />
                  </FloatingLabel>
                </div>
                <div className="col-md-6">
                  <FloatingLabel controlId="floatingInput" label="Confirm password" className="mb-3">
                    <Form.Control type="password" value={passwordConfirm} placeholder="Retype your password here" onChange={(event) => (setPasswordConfirm(event.target.value))} />
                  </FloatingLabel>
                </div>
              </Row>

              <h4 className="text-start mb-3">Your address</h4>
              <Row>
                <div className="col-md-4">
                  <Form.Select size="lg" value={country} className="mb-3" onChange={(event) => (setCountry(event.target.value))}>
                    <option value="-1">Country</option>
                    {Country.getAllCountries().map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                    ))}
                  </Form.Select>
                </div>
                <div className="col-md-4">
                  <Form.Select size="lg" value={region} className="mb-3" onChange={(event) => (setRegion(event.target.value))}>
                    <option value="-1">Region</option>
                    {country !== -1 && State.getStatesOfCountry(country).map((r) => (
                      <option key={r.isoCode} value={r.isoCode}>{r.name}</option>
                    ))}
                  </Form.Select>
                </div>
                <div className="col-md-4">
                  <Form.Select size="lg" value={city} className="mb-3" onChange={(event) => (setCity(event.target.value))}>
                    <option value="-1">City</option>
                    {country !== -1 && region !== -1 && City.getCitiesOfState(country, region).map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </Form.Select>
                </div>
              </Row>
              <Row className="mb-3">
                <div className="col-md-9">
                  <FloatingLabel controlId="floatingInput" label="Address" className="mb-3">
                    <Form.Control type="text" placeholder="Type your address here" value={address} onChange={(event) => (setAddress(event.target.value))} />
                  </FloatingLabel>
                </div>
                <div className="col-md-3">
                  <FloatingLabel controlId="floatingInput" label="Zip code" className="mb-3">
                    <Form.Control type="number" placeholder="Type your zip code here" value={zip} onChange={(event) => (setZip(event.target.value))} />
                  </FloatingLabel>
                </div>
              </Row>
              <h4 className="text-start mb-3">Let us know you better</h4>
              <div className="d-block">
                <FloatingLabel controlId="floatingTextarea2" label="Describe yourself">
                  <Form.Control
                    as="textarea"
                    placeholder="Leave your description here"
                    value={description}
                    onChange={(event) => (setDescription(event.target.value))}
                    style={{ height: '200px' }}
                  />
                </FloatingLabel>
              </div>
              <div className="d-block text-center">
                <small className="text-danger d-block">{nameError}</small>
                <small className="text-danger d-block">{surnameError}</small>
                <small className="text-danger d-block">{emailError}</small>
                <small className="text-danger d-block">{phoneError}</small>
                <small className="text-danger d-block">{passwordError}</small>
                <small className="text-danger d-block">{passwordConfirmError}</small>
                <small className="text-danger d-block">{countryError}</small>
                <small className="text-danger d-block">{regionError}</small>
                <small className="text-danger d-block">{cityError}</small>
                <small className="text-danger d-block">{addressError}</small>
                <small className="text-danger d-block">{zipError}</small>
                <small className="text-danger d-block">{sendApplicationError}</small>
              </div>
              <hr />

              <div className="subBtn">
                <Button variant="secondary" type="button" size="lg" className="mb-3" onClick={() => (handleClear())}>
                  Clear form data
                </Button>
                <Button variant="primary" type="button" size="lg" className="mx-2 mb-3" onClick={(event) => (handleSubmit(event))}>
                  Submit application
                </Button>
              </div>

            </Form>
          </div>
        </>}
      </div>

    </>
  )


}

export default FarmerRegistration
