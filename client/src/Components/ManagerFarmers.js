import { useEffect, useState } from "react";
import { Card, Badge, Button, Spinner, Form, FloatingLabel, Row, Alert } from 'react-bootstrap';
import { useHistory } from "react-router";
import dayjs from 'dayjs';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import { Country, State, City } from 'country-state-city';
import API from './../API';


function ManagerFarmers(props) {

  const [pendingApplications, setPendingApplications] = useState([]);
  const [refreshPendingApplication, setRefreshPendingApplications] = useState(props.pendingOnly);

  const [acceptedApplications, setAcceptedApplications] = useState([]);
  const [refreshAcceptedApplication, setRefreshAcceptedApplications] = useState(props.acceptedOnly);

  const [inspectApplication, setInspectApplication] = useState(null);

  const [operationAlert, setOperationAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  /*retrieve pending applications only if props.pendingOnly is set to TRUE*/
  useEffect(() => {
    if (!refreshPendingApplication) {
      return;
    }
    const getPendingApplications = async () => {
      setLoading(true);
      setRefreshPendingApplications(false);

      const applications = await API.getFarmerPendingApplications();

      setPendingApplications(applications);

      setLoading(false);

    }
    getPendingApplications();
  }, [refreshPendingApplication]);

  /*retrieve accepted applications only if props.acceptedOnly is set to TRUE*/
  useEffect(() => {
    if (!refreshAcceptedApplication) {
      return;
    }
    const getAcceptedApplications = async () => {
      setLoading(true);
      setRefreshAcceptedApplications(false);

      const applications = await API.getFarmerAcceptedApplications();

      setAcceptedApplications(applications);

      setLoading(false);

    }
    getAcceptedApplications();
  }, [refreshAcceptedApplication]);

  const handleBackButton = () => {
    if (inspectApplication) {
      setInspectApplication(null);
      return;
    }
    history.push("/manager");
  }

  /*Utility functions*/
  const capitalizeEachFirstLetter = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
  };

  const calculateElapsedTime = (receivedTime) => {
    const currTime = dayjs(props.time.date + ' ' + props.time.hour);
    const applicationTime = dayjs(receivedTime);

    if (currTime.diff(applicationTime, 'month') === 0) {
      if (currTime.diff(applicationTime, 'day') === 0) {
        if (currTime.diff(applicationTime, 'hour') === 0) {
          if (currTime.diff(applicationTime, 'minute') === 0) {
            return 'now';
          }
          else if (currTime.diff(applicationTime, 'minute') === 1) {
            return currTime.diff(applicationTime, 'minute') + ' minute ago';
          }
          else {
            return currTime.diff(applicationTime, 'minute') + ' minutes ago';
          }
        }
        else if (currTime.diff(applicationTime, 'hour') === 1) {
          return currTime.diff(applicationTime, 'hour') + ' hour ago';
        }
        else {
          return currTime.diff(applicationTime, 'hour') + ' hours ago';
        }
      }
      else if (currTime.diff(applicationTime, 'day') === 1) {
        return currTime.diff(applicationTime, 'day') + ' day ago';
      }
      else {
        return currTime.diff(applicationTime, 'day') + ' days ago';
      }
    }
    else if (currTime.diff(applicationTime, 'month') === 1) {
      return currTime.diff(applicationTime, 'month') + ' month ago';
    }
    else {
      return currTime.diff(applicationTime, 'month') + ' months ago';
    }

  }

  return (
    <div className="row">
      <span className="d-block text-center mt-5 mb-2 display-2">
        {props.pendingOnly && 'Pending applications'}
        {props.acceptedOnly && 'Accepted applications'}
      </span>
      <h5 className="d-block mx-auto mb-5 text-center text-muted">
        {props.pendingOnly && 'Examine the applications below and approve or reject them'}
        {props.acceptedOnly && 'Browse and see in detail previously accepted applications'}
      </h5>
      {operationAlert &&
        <div className="row">
          <div className="d-block">
            <Alert
              variant={operationAlert.type}
              dismissible={true}
              onClose={() => setOperationAlert(null)}
            >
              {operationAlert.msg}
            </Alert>
          </div>
        </div>
      }
      <div className="container">
        <div className="row">
          <div className="col-lg-2 text-center">
            <Button variant="secondary" className="mb-4" onClick={() => (handleBackButton())}>Go back</Button>
          </div>
          <div className="col-lg-8">
            {loading &&
              <div className="d-block my-5 text-center">
                <Spinner className="mx-auto" animation="grow" />
              </div>}
            {!loading && inspectApplication === null && props.pendingOnly && pendingApplications.map((a) => (
              <Card key={a.id} className="mb-4 shadow" border="secondary">
                <Card.Header as="h4">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-6 text-start">
                        {applicationIcon} Farmer application
                      </div>
                      <div className="col-lg-6 text-end my-auto">
                        <h5 className="my-auto">
                          <Badge bg="warning" text="dark">
                            Status: pending
                          </Badge>
                        </h5>
                      </div>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Card.Title className="ms-5">{capitalizeEachFirstLetter(a.name) + ' ' + capitalizeEachFirstLetter(a.surname)}</Card.Title>
                  <Card.Text className="ms-5">
                    Location: {a.location}<br />
                    Address: {a.complete_address}
                  </Card.Text>
                  <div className="d-block text-center">
                    <Button variant="primary" onClick={() => (setInspectApplication(a))}>{viewApplicationIcon} View application</Button>
                  </div>
                </Card.Body>
                <Card.Footer className="text-muted">Application received {calculateElapsedTime(a.date)}</Card.Footer>
              </Card>
            ))}
            {!loading && inspectApplication === null && props.acceptedOnly && acceptedApplications.map((a) => (
              <Card key={a.id} className="mb-4 shadow" border="secondary">
                <Card.Header as="h4">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-6 text-start my-auto">
                        {applicationIcon} Farmer application
                      </div>
                      <div className="col-lg-6 text-end my-auto">
                        <h5 className="my-auto">
                          <Badge bg={a.status === 'accepted' ? 'success' : 'danger'} text="dark">
                            Status: {a.status}
                          </Badge>
                        </h5>
                      </div>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Card.Title className="ms-5">{capitalizeEachFirstLetter(a.name) + ' ' + capitalizeEachFirstLetter(a.surname)}</Card.Title>
                  <Card.Text className="ms-5">
                    Location: {a.location}<br />
                    Address: {a.complete_address}
                  </Card.Text>
                  <div className="d-block text-center">
                    <Button variant="primary" onClick={() => (setInspectApplication(a))}>{viewApplicationIcon} View application</Button>
                  </div>
                </Card.Body>
                <Card.Footer className="text-muted">Application received {calculateElapsedTime(a.date)}</Card.Footer>
              </Card>
            ))}
            {!loading && inspectApplication &&
              <ApplicationInspector application={inspectApplication}
                pendingOnly={props.pendingOnly}
                acceptedOnly={props.acceptedOnly}
                setInspectApplication={setInspectApplication}
                setAlert={setOperationAlert}
                setRefreshPendingApplications={setRefreshPendingApplications}
                setRefreshAcceptedApplications={setRefreshAcceptedApplications}
              />}
          </div>
          <div className="col-lg-2" />

        </div>
      </div >
    </div >
  );

}

function ApplicationInspector(props) {

  const [countryCode] = useState(Country.getAllCountries().find((c) => (c.name === props.application.country)).isoCode);
  const [regionCode] = useState(State.getStatesOfCountry(Country.getAllCountries().find((c) => (c.name === props.application.country)).isoCode).find((r) => (r.name === props.application.region)).isoCode);

  const [updateApplication, setUpdateApplication] = useState("");

  /*accept or reject application*/
  useEffect(() => {
    if (updateApplication === "") {
      return;
    }
    const update = async () => {
      setUpdateApplication('');

      if (updateApplication === 'accept') {
        const response = await API.acceptFarmerApplication(props.application.id);
        if (response) {
          props.setAlert({ type: 'success', msg: 'The farmer application has been successfully accepted.' });
        }
        else {
          props.setAlert({ type: 'danger', msg: 'Oops! An error occurred and the application status could not be changed. Please try again later.' });
        }
      }
      else {
        const response = await API.rejectFarmerApplication(props.application.id);
        if (response) {
          props.setAlert({ type: 'success', msg: 'The farmer application has been successfully rejected.' });
        }
        else {
          props.setAlert({ type: 'danger', msg: 'Oops! An error occurred and the application status could not be changed. Please try again later.' });
        }
      }
      props.setInspectApplication(null);
      if(props.pendingOnly){
        props.setRefreshPendingApplications(true);
      }
      else{
        props.setRefreshAcceptedApplications(true);
      }
    }
    update();
  }, [updateApplication])

  return (
    <div className="d-block text-center border border-secondary rounded-3 shadow w-100 mb-5">
      <Form className="m-3">
        <h2 className="text-center">Farmer application form</h2>
        <hr />
        <div className="d-block my-0 p-0 text-end">
          {props.pendingOnly && <Badge bg="warning" text="dark">
            Status: pending
          </Badge>}
          {props.acceptedOnly && props.application.status === 'accepted' &&
            <Badge bg="success" text="dark">
              Status: accepted
            </Badge>}
          {props.acceptedOnly && props.application.status === 'rejected' &&
            <Badge bg="danger" text="dark">
              Status: rejected
            </Badge>}
        </div>
        {/*Personal information*/}
        <h4 className="text-start mb-3">Farmer data</h4>
        <Row>
          <div className="col-md-6">
            <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
              <Form.Control type="text" placeholder="Type your name here" value={props.application.name} readOnly />
            </FloatingLabel>
          </div>
          <div className="col-md-6">
            <FloatingLabel controlId="floatingInput" label="Surname" className="mb-3">
              <Form.Control type="text" placeholder="Type your surname here" value={props.application.surname} readOnly />
            </FloatingLabel>
          </div>
        </Row>
        {/*Contact information*/}
        <Row>
          <div className="col-md-6">
            <FloatingLabel controlId="floatingInput" label="Email" className="mb-3">
              <Form.Control type="text" placeholder="Type your email here" value={props.application.email} readOnly />
            </FloatingLabel>
          </div>
          <div className="col-md-6">
            <PhoneInput
              containerClass="mb-3"
              inputClass="w-100 rounded"
              inputStyle={{ height: "99%" }}
              placeholder="Phone number"
              value={props.application.phone}
              disabled={true}
            />
          </div>
        </Row>

        <h4 className="text-start mb-3">Farmer address</h4>
        <Row className="mb-3">
          <div className="col-md-4">
            <Form.Select className="mb-3" size="lg" value={countryCode} disabled={true}>
              {Country.getAllCountries().map((c) => (
                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
              ))}
            </Form.Select>
          </div>
          <div className="col-md-4">
            <Form.Select className="mb-3" size="lg" value={regionCode} disabled={true}>
              {State.getStatesOfCountry(countryCode).map((r) => (
                <option key={r.isoCode} value={r.isoCode}>{r.name}</option>
              ))}
            </Form.Select>
          </div>
          <div className="col-md-4">
            <Form.Select className="mb-3" size="lg" value={props.application.city} disabled={true}>
              <option value="-1">City</option>
              {City.getCitiesOfState(countryCode, regionCode).map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </Form.Select>
          </div>
        </Row>
        <Row className="mb-3">
          <div className="col-md-9">
            <FloatingLabel controlId="floatingInput" label="Address" className="mb-3">
              <Form.Control type="text" placeholder="Type your address here" value={props.application.address} readOnly />
            </FloatingLabel>
          </div>
          <div className="col-md-3">
            <FloatingLabel controlId="floatingInput" label="Zip code" className="mb-3">
              <Form.Control type="number" placeholder="Type your zip code here" value={props.application.zip} readOnly />
            </FloatingLabel>
          </div>
        </Row>
        <h4 className="text-start mb-3">Let us know you better</h4>
        <div className="d-block">
          <FloatingLabel controlId="floatingTextarea2" label="Farmer description">
            <Form.Control
              as="textarea"
              placeholder="Leave your description here"
              value={props.application.description}
              style={{ height: '200px' }}
              readOnly
            />
          </FloatingLabel>
        </div>
        <hr />
        {
          props.pendingOnly &&
          <div className="subBtn">
            <Button variant="danger" type="button" size="lg" className="mb-2" onClick={() => (setUpdateApplication('reject'))}>
              Reject application
            </Button>
            <Button variant="primary" type="button" size="lg" className="mx-2 mb-2" onClick={() => (setUpdateApplication('accept'))}>
              Accept application
            </Button>
          </div>
        }
        {
          props.acceptedOnly &&
          <div className="subBtn">
            <Button variant="primary" type="button" size="lg" className="mx-2 mb-2" onClick={() => (props.setInspectApplication(null))}>
              Finish inspection and go back
            </Button>
            {props.application.status === 'rejected' &&
              <Button variant="success" type="button" size="lg" className="mx-2 mb-2" onClick={() => (setUpdateApplication('accept'))}>
                Accept appplication
              </Button>
            }
          </div >
        }

      </Form >
    </div >
  )
}

const applicationIcon =
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-file-person" viewBox="0 0 16 16">
    <path d="M12 1a1 1 0 0 1 1 1v10.755S12 11 8 11s-5 1.755-5 1.755V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z" />
    <path d="M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  </svg>

const viewApplicationIcon = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
</svg>


export default ManagerFarmers;
