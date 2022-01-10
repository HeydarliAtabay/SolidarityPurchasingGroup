import { useEffect, useState } from 'react';
import {
  Form,
  OverlayTrigger,
  Popover,
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Button,
} from 'react-bootstrap';
import dayjs from 'dayjs';
import { Link, useHistory } from 'react-router-dom';

const MyNavbar = function (props) {
  const [date, setDate] = useState(dayjs(props.time.date).format('YYYY-MM-DD'));
  const [time, setTime] = useState(props.time.hour);

  const [cartNumber, setCartNumber] = useState(0);

  const getUserRole = () => {
    if (props.userRole === 'client') {
      return 'Client';
    } else if (props.userRole === 'employee') {
      return 'Shop employee';
    } else if (props.userRole === 'farmer') {
      return 'Farmer';
    } else if (props.userRole === 'warehouse-employee') {
      return 'Warehouse employee';
    } else if (props.userRole === 'warehouse-manager') {
      return 'Warehouse manager';
    } else if (props.userRole === 'delivery-personnel') {
      return 'Delivery employee';
    }
  };

  const history = useHistory();

  useEffect(() => {
    if (!props.cartUpdated || !props.loggedIn) {
      return;
    }

    if (props.userRole === 'client') {
      setCartNumber(
        props.cartItems.has(props.clientid)
          ? props.cartItems.get(props.clientid).items.length
          : 0
      );
    }
    if (props.userRole === 'employee') {
      setCartNumber(props.cartItems.size);
    }

    props.setCartUpdated(false);
  }, [props.cartUpdated]);

  return (
    <Navbar
      variant="dark"
      expand="lg"
      className="p-1 w-100 shadow"
      style={{ backgroundColor: '#687864' }}
    >
      <Container className="text-light w-100-custom">
        {
          /*toggleNavbarBrand() === "SPG_logo" &&*/
          <Navbar.Brand
            className="p-0 pe-4 my-auto border-end text-light fs-1"
            href="#home"
            onClick={() => history.push('/')}
          >
            <div className="d-inline my-auto">{shopIcon}</div>
            <div className="d-inline mt-auto"> S P G</div>
          </Navbar.Brand>
        }
        {/*toggleNavbarBrand() === "Back_button" &&
          <Navbar.Brand className="p-0 pe-4 ms-0 my-auto border-end text-light fs-4" href="/">
            <div className="d-inline my-auto">{backIcon}</div>
            <div className="d-inline mt-auto" onClick={() => (history.goBack())}> Back</div>
          </Navbar.Brand>*/}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{ color: '#FFFFFF' }}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto my-auto">
            <ul className="navbar-nav me-auto" style={{ fontSize: 22 }}>
              {props.loggedIn && (
                <li className="nav-item">
                  <Link to="/" className="nav-link text-light">
                    Home
                  </Link>
                </li>
              )}

              {/* CLIENT NAVBAR */}
              {props.userRole === 'client' && props.suspended === 0 && (
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-light">
                    Client area
                  </Link>
                </li>
              )}
              {props.userRole === 'client' && props.suspended === 0 && (
                <NavDropdown
                  className="text-light"
                  title="Shopping"
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item
                    className="fw-bold"
                    href="#"
                    onClick={() => history.push('/booking')}
                  >
                    Book products
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    className="fw-bold"
                    href="#"
                    onClick={() => history.push('/products-next-week')}
                  >
                    Explore next week products
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {props.userRole === 'client' && (
                <li className="nav-item">
                  <Link to="/orders" className="nav-link text-light">
                    My orders
                  </Link>
                </li>
              )}

              {/* SHOP EMPLOYEE NAVBAR */}
              {props.userRole === 'employee' && (
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-light">
                    Staff area
                  </Link>
                </li>
              )}
              {props.userRole === 'employee' && (
                <NavDropdown
                  className="text-light"
                  title="Products"
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item
                    className="fw-bold"
                    href="#"
                    onClick={() => history.push('/booking')}
                  >
                    Products to be delivered
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {props.userRole === 'employee' && (
                <NavDropdown
                  className="text-light"
                  title="Clients"
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item
                    className="fw-bold"
                    href="#"
                    onClick={() => history.push('/booking')}
                  >
                    Register new client
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    className="fw-bold"
                    href="#"
                    onClick={() => history.push('/booking')}
                  >
                    Make order for client
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    className="fw-bold"
                    href="#"
                    onClick={() => history.push('/booking')}
                  >
                    Top-up client wallet
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {/* SHOP MANAGER NAVBAR */}
              {props.userRole === 'shop-manager' && (
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-light">
                    Manager area
                  </Link>
                </li>
              )}
              {props.userRole === 'shop-manager' && (
                <NavDropdown title="Applications" id="basic-nav-dropdown">
                  <NavDropdown.Item
                    className="fw-bold"
                    href="#"
                    onClick={() =>
                      history.push('/manager/applications/pending')
                    }
                  >
                    Pending applications
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    className="fw-bold"
                    href="#"
                    onClick={() =>
                      history.push('/manager/applications/processed')
                    }
                  >
                    Accepted/rejected applications
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {/* FARMER NAVBAR */}
              {props.userRole === 'farmer' && (
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-light">
                    Farmer area
                  </Link>
                </li>
              )}
              {props.userRole === 'farmer' && (
                <NavDropdown
                  menuVariant="light"
                  title="Products"
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item
                    className="fw-bold"
                    href="#"
                    onClick={() => history.push('/declare-availability')}
                  >
                    Declare product availability
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    className="fw-bold"
                    href="#"
                    onClick={() => history.push('/order-confirmation-farmer')}
                  >
                    Confirm product availability
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {props.userRole === 'farmer' && (
                <NavDropdown
                  className="text-light"
                  title="Orders"
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item
                    className="fw-bold"
                    href="#"
                    onClick={() => history.push('/order-preparation')}
                  >
                    Confirm order preparation
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {/* WHMANAGER NAVBAR */}
              {props.userRole === 'warehouse-manager' && (
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-light">
                    Warehouse area
                  </Link>
                </li>
              )}
              {props.userRole === 'warehouse-manager' && (
                <li className="nav-item">
                  <Link to="/warehouse-orders" className="nav-link text-light">
                    Pick-up schedule
                  </Link>
                </li>
              )}
              {props.userRole === 'warehouse-manager' && (
                <li className="nav-item">
                  <Link
                    to="/warehouse-shipments"
                    className="nav-link text-light"
                  >
                    Farmer shipments
                  </Link>
                </li>
              )}

              {/* WHEMPLOYEE NAVBAR */}
              {props.userRole === 'warehouse-employee' && (
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-light">
                    Warehouse area
                  </Link>
                </li>
              )}
              {props.userRole === 'warehouse-employee' && (
                <li className="nav-item">
                  <Link to="/warehouse-prepare" className="nav-link text-light">
                    Order preparation
                  </Link>
                </li>
              )}

              {/* DELIVERER NAVBAR */}
              {props.userRole === 'delivery-personnel' && (
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-light">
                    Deliverer area
                  </Link>
                </li>
              )}
            </ul>

            {/* HOMEPAGE NAVBAR */}
            {!props.loggedIn && (
              <div className="ps-2">
                <div className="d-block fs-3">Solidarity Purchase Group</div>
                Your ultimate fresh and bio food destination
              </div>
            )}
          </Nav>

          <Nav className="ms-auto me-0">
            {props.loggedIn && (
              <div className="py-2 my-auto nav-accessory">
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  rootClose={true}
                  overlay={
                    <Popover className="shadow-lg">
                      <Popover.Header>
                        <h3>Hi {props.userName}!</h3>
                      </Popover.Header>
                      <Popover.Body>
                        <h5 className="mb-2 mx-3">{props.userMail}</h5>
                        <div className="d-block text-center">
                          Account type: {getUserRole()}
                        </div>
                        <hr />
                        <button
                          className="btn btn-danger d-block ms-auto"
                          onClick={() => {
                            props.logout();
                            history.push('/');
                          }}
                        >
                          Logout
                        </button>
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <div className="my-auto">
                    {' '}
                    Logged in as: <b>{props.userName}</b> {userIcon}
                  </div>
                </OverlayTrigger>
              </div>
            )}
            {!props.loggedIn && (
              <ul className="navbar-nav my-auto" style={{ fontSize: 22 }}>
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-light">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/registration" className="nav-link text-light">
                    Sign up
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/farmer-apply" className="nav-link text-light">
                    Apply
                  </Link>
                </li>
              </ul>
            )}
            {props.userRole === 'client' && (
              <>
                {props.suspended === 0 && (<> <div className="px-2 border-end" /> </> )}{/*spacer divs*/}
                <div className="px-2" /> {/*spacer divs*/}
                <div className="my-auto py-2 nav-accessory">
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom"
                    rootClose={true}
                    overlay={
                      <Popover className="shadow-lg">
                        <Popover.Header>
                          <h3>Shopping cart</h3>
                        </Popover.Header>
                        <Popover.Body>
                          <div
                            className="d-block text-center"
                            style={{ fontSize: '20px' }}
                          >
                            {cartNumber === 0 && 'Cart is empty'}
                            {cartNumber > 0 && cartNumber + ' items in cart'}
                          </div>
                          <div className="d-block text-center">
                            {cartNumber > 0 && (
                              <Button
                                style={{ borderRadius: '25px' }}
                                variant="success"
                                onClick={() => history.push('/cart')}
                              >
                                Proceed to purchase
                              </Button>
                            )}
                          </div>
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <span className="position-relative">
                      {props.suspended === 0 && ( <>
                      {cartIcon}
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cartNumber}
                        <span className="visually-hidden">Cart items</span>
                      </span>
                      </>)}
                    </span>
                  </OverlayTrigger>
                </div>
              </>
            )}
            {props.userRole === 'employee' && (
              <>
                <div className="px-2 border-end" /> {/*spacer divs*/}
                <div className="px-2" /> {/*spacer divs*/}
                <div className="my-auto py-2 nav-accessory">
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom"
                    rootClose={true}
                    overlay={
                      <Popover className="shadow-lg">
                        <Popover.Header>
                          <h3>Shopping cart</h3>
                        </Popover.Header>
                        <Popover.Body>
                          <div className="d-block text-center">
                            {cartNumber === 0 &&
                              'No items added to cart for any client'}
                            {cartNumber > 0 &&
                              cartNumber + ' active client carts'}
                          </div>
                          <div className="d-block text-center">
                            <Button
                              variant="success"
                              onClick={() => history.push('/cart')}
                            >
                              Go to cart
                            </Button>
                          </div>
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <span className="position-relative">
                      {cartIcon}
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cartNumber}
                        <span className="visually-hidden">Cart items</span>
                      </span>
                    </span>
                  </OverlayTrigger>
                </div>
              </>
            )}
            <div className="px-2 border-end" /> {/*spacer divs*/}
            <div className="px-2" /> {/*spacer divs*/}
            <div className="my-auto py-2 nav-accessory">
              <OverlayTrigger
                trigger="click"
                placement="bottom"
                rootClose={true}
                overlay={
                  <Popover className="shadow-lg">
                    <Popover.Header>
                      <h3>Virtual clock setter</h3>
                    </Popover.Header>
                    <Popover.Body>
                      <Form.Group>
                        <Form.Label as="h6">Virtual date</Form.Label>
                        <Form.Control
                          type="date"
                          value={date}
                          onChange={(event) => {
                            setDate(event.target.value);
                            props.setTime((newTime) => ({
                              date: event.target.value,
                              hour: newTime.hour,
                            }));
                          }}
                        />
                      </Form.Group>
                      <hr />
                      <Form.Group className="mt-3">
                        <Form.Label as="h6">Virtual time</Form.Label>
                        <Form.Control
                          type="time"
                          value={time}
                          onChange={(event) => {
                            setTime(event.target.value);
                            props.setTime((newTime1) => ({
                              date: newTime1.date,
                              hour: event.target.value,
                            }));
                          }}
                        />
                      </Form.Group>
                    </Popover.Body>
                  </Popover>
                }
              >
                <div className='container'>
                  <div className="row">
                    <div className='col-6 text-center my-auto'>
                      {clockIcon}
                    </div>
                    <div className='col-6 text-center my-auto'>
                      <div className='d-block mx-auto fw-bold'>{dayjs(props.time.date).format('dddd')}</div>
                      <div className='d-block mx-auto'>{props.time.hour}</div>
                    </div>
                  </div>
                </div>
              </OverlayTrigger>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const shopIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    fill="currentColor"
    className="bi bi-shop"
    viewBox="0 0 16 16"
  >
    <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z" />
  </svg>
);

const clockIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-clock"
    viewBox="0 0 16 16"
  >
    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
  </svg>
);

const userIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-person-circle"
    viewBox="0 0 16 16"
  >
    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    <path
      fillRule="evenodd"
      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
    />
  </svg>
);

const cartIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-cart3"
    viewBox="0 0 16 16"
  >
    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
  </svg>
);

export default MyNavbar;
