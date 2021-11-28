import { useState } from 'react';
import {Row, Col , Form} from 'react-bootstrap'

const Navbar = function (props) {

  const [date, setDate] = useState(props.time.date);
  const [time, setTime] = useState(props.time.hour);

  return (
    <nav className="navbar navbar-expand-lg menu-bar">
      <div className="container-fluid">
        <a className="navbar-brand" style={{ fontSize: 30 }} href="/">
          Solidarity Purchasing Group
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul
            className="navbar-nav me-auto mb-2 mb-lg-0"
            style={{ fontSize: 30 }}
          >
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/home">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/login">
                Client
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/login">
                Staff
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/farmer">
                Farmer
              </a>
            </li>
          </ul>
          
          
          <Form.Group>
        <Row>
          <Col>
          <Form.Control type="date" value={date} onChange={(event) =>{
              setDate(event.target.value)
              props.setTime((time) => ({
                date: event.target.value,
                hour: time.hour,
              }))}}/>
          <Form.Control.Feedback type='invalid'> </Form.Control.Feedback>
          </Col>
          <Col>
          <Form.Control type="time" value={time} 
            onChange={(event) =>{
              setTime(event.target.value);
              props.setTime((time) => ({
                date: time.day,
                hour: event.target.value,
              }))}}/>
          </Col>
        </Row>
      </Form.Group>
  
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
 
