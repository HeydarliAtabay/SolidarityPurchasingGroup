import { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap'
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const Navbar = function (props) {

  const [date, setDate] = useState(dayjs(props.time.date).format("YYYY-MM-DD"));
  const [time, setTime] = useState(props.time.hour);

  return (
    <nav className="navbar navbar-expand-lg menu-bar">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand pe-3 border-end" style={{ fontSize: 40 }}>
          {shopIcon} S P G
        </Link>
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
        <div className="collapse navbar-collapse my-auto" id="navbarNav">
          <ul
            className="navbar-nav me-auto"
            style={{ fontSize: 22 }}
          >
            <li className="nav-item">
              <Link to="/" className="nav-link active">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link active">
                Client
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link active">
                Staff
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/farmer" className="nav-link active">
                Farmer
              </Link>
            </li>
          </ul>


          <Form.Group>
            <Row>
              <Col>
                <Form.Control type="date" value={date} onChange={(event) => {
                  setDate(event.target.value)
                  props.setTime((time) => ({
                    date: event.target.value,
                    hour: time.hour,
                  }))
                }} />
                <Form.Control.Feedback type='invalid'> </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Control type="time" value={time}
                  onChange={(event) => {
                    setTime(event.target.value);
                    props.setTime((time) => ({
                      date: time.date,
                      hour: event.target.value,
                    }))
                  }} />
              </Col>
            </Row>
          </Form.Group>

        </div>

      </div>
    </nav>
  );
};

const shopIcon = <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-shop" viewBox="0 0 16 16">
  <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z" />
</svg>

export default Navbar;

