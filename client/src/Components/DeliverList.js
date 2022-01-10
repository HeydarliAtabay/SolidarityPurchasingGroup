import {
  Button,
  Row,
  Col,
  Form,
  Alert,
  Modal,
  Table,
  Badge,
  Container,
} from 'react-bootstrap';
import { Telephone, Envelope } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import API from '../API';
import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
var isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrBefore);

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

toast.configure();

function DeliverList(props) {
  const { time } = props;
  const [show, setShow] = useState(false);
  const [showClient, setShowClient] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contactType, setContactType] = useState(0);
  const [shouldBeNotified, setShouldBeNotified] = useState(0);
  const [pickupDate, setPickupDate] = useState({
    date: '',
    hour: '',
  });
  const [id, setId] = useState(-1);
  const [client, setClient] = useState(0);

  const [handoutOrderID, setHandoutOrderID] = useState(-1);
  const [actionAlert, setActionAlert] = useState(null);

  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const [orderStatusID, setOrderStatusID] = useState(-1);

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [payOrder, setPayOrder] = useState(false);

  let m = props.orders.map((s) => s.order_id).filter(onlyUnique);
  m.reverse();

  useEffect(() => {
    if (handoutOrderID === -1) {
      return;
    }

    const handoutOrder = async () => {
      try {
        let array2 = props.orders
          .filter((x) => x.order_id === handoutOrderID)
          .map((x) => x.product_name);
        for (const a of array2) {
          await API.updateDelivered(handoutOrderID, a);
        }
        props.setRecharged(true);
        setActionAlert({
          variant: 'success',
          msg: 'Order #' + handoutOrderID + ' was successfully handed out.',
        });
      } catch (error) {
        console.log(error);
        setActionAlert({
          variant: 'danger',
          msg: 'Order #' + handoutOrderID + ' could not be handed out.',
        });
      }
      props.setRecharged(true);
    };

    handoutOrder();
  }, [handoutOrderID]);

  useEffect(() => {
    if (!payOrder) {
      return;
    }

    const confirmOrderPayment = async () => {
      try {
        const budget = parseFloat(props.clients.find(c => c.client_id === props.orders.find(o => o.order_id === id).client_id).budget.toFixed(2));
        const orderPrice = parseFloat(props.orders.filter(o => o.order_id === id).reduce((a, b) => (parseFloat(a.OrderPrice) + parseFloat(b.OrderPrice))).toFixed(2));
        if (budget < orderPrice) {
          console.log('budget not enough');
          throw false;
        }
        await API.updateState(id, 'booked');
        await API.increaseBalance((budget - orderPrice) * (-1), props.orders.find(o => o.order_id === id).client_id);
        props.setRecharged(true);
        props.setRecharged1(true);

        setActionAlert({
          variant: 'success',
          msg: 'Order #' + id + ' payment was successfully completed and the client budget was updated.',
        });
      }
      catch (error) {
        console.log(error);
        setActionAlert({
          variant: 'danger',
          msg: 'Order #' + id + ' payment could not be completed.',
        });
      }
      setShowPaymentModal(false);
      setPayOrder(false);
    }
    confirmOrderPayment();
  }, [payOrder])

  const getOrderStatus = (order_id) => {
    let min = 1000;
    let orderStatus = null;

    props.orders
      .filter((o) => o.order_id === order_id)
      .forEach((item) => {
        let orderStatusLocal = null;
        let num_steps = 0;

        if (item.state === 'missed') {
          orderStatusLocal = 'Missed by client';
          num_steps = 0;
        } else if (item.state === 'pending') {
          orderStatusLocal = 'Payment pending';
          num_steps = 0;
        } else if (item.state === 'booked') {
          orderStatusLocal = 'Payment completed';
          num_steps = 1;
        } else if (item.state === 'booked' && item.farmer_state === 'confirmed') {
          orderStatusLocal = 'Payment completed';
          num_steps = 1;
        } else if (
          item.state === 'booked' &&
          item.farmer_state === 'farmer-shipped'
        ) {
          orderStatusLocal = 'Shipped by farmer';
          num_steps = 2;
        } else if (item.state === 'received') {
          orderStatusLocal = 'Received by warehouse';
          num_steps = 3;
        } else if (item.state === 'prepared') {
          orderStatusLocal = 'Prepared by warehouse';
          num_steps = 4;
        } else if (item.state === 'shipped') {
          orderStatusLocal = 'Shipped';
          num_steps = 5;
        } else if (item.state === 'delivered') {
          orderStatusLocal = 'Delivered';
          num_steps = 6;
        }

        if (num_steps < min) {
          orderStatus = orderStatusLocal;
          min = num_steps;
        }
      });

    return orderStatus;
  };

  const handleClose = (x) => {
    setShow(x);
    setShowClient(x);
    setShowContact(x);
  };

  const checkOrderReadyForPickup = (order_id) => {
    const orderArray = props.orders.filter(o => o.order_id === order_id);
    for (const order of orderArray) {
      if (order.pickup !== 1 || order.state !== 'prepared') {
        return false;
      }
    }
    return true;
  }

  const checkOrderDelivered = (order_id) => {
    const orderArray = props.orders.filter(o => o.order_id === order_id);
    for (const order of orderArray) {
      if (order.state !== 'delivered') {
        return false;
      }
    }
    return true;
  }

  const checkOrderPaymentPending = (order_id) => {
    const orderArray = props.orders.filter(o => o.order_id === order_id);
    for (const order of orderArray) {
      if (order.state === 'pending') {
        return true;
      }
    }
    return false;
  }

  const checkOrderPickupIsLate = (order_id) => {
    const orderArray = props.orders.filter(o => o.order_id === order_id);
    const currDate = dayjs(props.time.date + ' ' + props.time.hour);
    for (const order of orderArray) {
      if (order.pickup === 1 && order.state!=='delivered' && currDate.isSameOrAfter(order.date + ' ' + order.time)) {
        return true;
      }
    }
    return false;
  }

  const checkOrderPickupIn24h = (order_id) => {
    const orderArray = props.orders.filter(o => o.order_id === order_id);
    const currDate = dayjs(props.time.date + ' ' + props.time.hour);
    for (const order of orderArray) {
      const pickupDate = dayjs(order.date + ' ' + order.time);
      if (order.pickup === 1 && currDate.isSameOrBefore(order.date + ' ' + order.time) && pickupDate.diff(currDate, 'hour') < 24) {
        return true;
      }
    }
    return false;
  }

  const checkOrderContactClient = (order_id) => {
    const orderArray = props.orders.filter(o => o.order_id === order_id);
    const currDate = dayjs(props.time.date + ' ' + props.time.hour);
    for (const order of orderArray) {
      if (order.pickup === 0 || currDate.isSameOrBefore(order.date + ' ' + order.time)) {
        return true;
      }
    }
    return false;
  }

  return (
    <>
      <span className="d-block text-center mt-5 mb-2 display-2">
        Client orders
      </span>
      <h5 className="d-block mx-auto mb-5 text-center text-muted">
        View and manage all the client orders by using the buttons on the table
        below
      </h5>
      <Container fluid>
        <Row>
          {/* action performed alert */
            actionAlert && (
              <Alert
                variant={actionAlert.variant}
                className="my-3 mx-2"
                dismissible={true}
                onClose={() => setActionAlert(null)}
              >
                {actionAlert.msg}
              </Alert>
            )}
          <Table
            striped
            bordered
            hover
            variant="light"
            responsive="lg"
            size="lg"
            className="px-5"
          >
            <thead>
              <tr>
                <th>Order id</th>
                <th>Client</th>
                <th>Products</th>
                <th>Total</th>
                <th>Order status</th>
                <th>Delivery Type</th>
                <th>Date & Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {props.orders.map((s) => {
                if (m.find((x) => parseInt(x) === parseInt(s.order_id))) {
                  let id1 = m[m.length - 1];
                  let array = props.orders
                    .filter((x) => x.order_id === id1)
                    .map((x) => x.OrderPrice);
                  let sum = 0;
                  for (const a of array) {
                    sum = sum + a;
                  }
                  sum = sum.toFixed(2);
                  m.pop();
                  return (
                    <tr key={s.id}>
                      {/* Order ID */}
                      <td className="align-middle"> {s.order_id}</td>

                      {/* Client name */}
                      <td className="align-middle">
                        {
                          props.clients.find((c) => c.client_id === s.client_id)
                            .name
                        }{' '}
                        {
                          props.clients.find((c) => c.client_id === s.client_id)
                            .surname
                        }{' '}
                      </td>

                      {/* Show order products modal */}
                      <td className="align-middle">
                        <Button
                          variant="link"
                          onClick={() => {
                            setShow(true);
                            setId(s.order_id);
                          }}
                        >
                          Show ordered products
                        </Button>
                      </td>

                      {/* Order price */}
                      <td className="align-middle">{sum}€</td>

                      {/* Show order status modal */}
                      <td className="align-middle">
                        <Button
                          variant="link"
                          onClick={() => {
                            setShowOrderStatus(true);
                            setOrderStatusID(s.order_id);
                          }}
                        >
                          {getOrderStatus(s.order_id)}
                        </Button>
                      </td>

                      {/* Order type (delivery/pickup) */}
                      <td className="align-middle">
                        {s.pickup === 0 ? 'Delivery' : 'Pick up'}
                      </td>

                      {/* Order delivery time */}
                      {dayjs(time.date + ' ' + time.hour).isSameOrAfter(
                        s.date + ' ' + s.time
                      ) && (!checkOrderDelivered) &&
                        s.pickup === 1 ? (
                        <td className="text-danger align-middle">
                          {dayjs(s.date + ' ' + s.time).format(
                            'ddd, MMM D, YYYY HH:mm'
                          )}{' '}
                          (not picked up)
                        </td>
                      ) : (
                        <td className="align-middle">
                          {dayjs(s.date + ' ' + s.time).format(
                            'ddd, MMM D, YYYY HH:mm'
                          )}
                        </td>
                      )}

                      {/* Action buttons */}
                      <td>
                        {/* Hand-out order button */
                          checkOrderReadyForPickup(s.order_id) && (
                            <Button
                              variant="success"
                              className="d-block my-1 mx-2 w-100"
                              onClick={() => {
                                setHandoutOrderID(s.order_id);
                              }}
                            >
                              Hand-out order
                            </Button>
                          )
                        }

                        {/* Notify pending + complete payment buttons */
                          checkOrderPaymentPending(s.order_id) && (
                            <>
                              <Button
                                variant="secondary"
                                className="d-block my-1 mx-2 w-100"
                                onClick={() => {
                                  setShowClient(true);
                                  setClient(s.client_id);
                                }}
                              >
                                Notify order pending
                              </Button>
                              <Button
                                variant="success"
                                className="d-block my-1 mx-2 w-100"
                                onClick={() => {
                                  setShowPaymentModal(true);
                                  setId(s.order_id);
                                }}
                              >
                                Complete order payment
                              </Button>
                            </>
                          )
                        }

                        {/* Notify Late for pickup button */
                          checkOrderPickupIsLate(s.order_id) && (
                            <Button
                              variant="secondary"
                              className="d-block my-1 mx-2 w-100"
                              onClick={() => {
                                setShowContact(true);
                                setClient(s.client_id);
                                setContactType(1);
                                setShouldBeNotified(0);
                                setPickupDate((prevState2) => ({
                                  ...prevState2,
                                  date: s.date,
                                  hour: s.time,
                                }));
                              }}
                            >
                              Notify missed pick-up
                            </Button>
                          )
                        }

                        {/* Notify pickup in the next 24h button */
                          checkOrderPickupIn24h(s.order_id) && (
                            <Button
                              variant="dark"
                              className="d-block my-1 mx-2 w-100"
                              onClick={() => {
                                setShowContact(true);
                                setClient(s.client_id);
                                setContactType(0);
                                if (
                                  Math.ceil(
                                    Math.abs(
                                      new Date(s.date) - new Date(time.date)
                                    ) /
                                    (1000 * 60 * 60 * 24)
                                  ) <= 1
                                ) {
                                  setShouldBeNotified(1);
                                  console.log('It will changed to 1');
                                } else {
                                  setShouldBeNotified(0);
                                }

                                setPickupDate((prevState1) => ({
                                  ...prevState1,
                                  date: s.date,
                                  hour: s.time,
                                }));
                              }}
                            >
                              Notify pick-up in the next 24h
                            </Button>
                          )
                        }

                        {/* Contact client button */
                          checkOrderContactClient(s.order_id) && (
                            <Button
                              variant="primary"
                              className="d-block my-1 mx-2 w-100"
                              onClick={() => {
                                setShowContact(true);
                                setClient(s.client_id);
                                setContactType(0);
                                if (
                                  Math.ceil(
                                    Math.abs(
                                      new Date(s.date) - new Date(time.date)
                                    ) /
                                    (1000 * 60 * 60 * 24)
                                  ) <= 1
                                ) {
                                  setShouldBeNotified(1);
                                } else {
                                  setShouldBeNotified(0);
                                }

                                setPickupDate((prevState3) => ({
                                  ...prevState3,
                                  date: s.date,
                                  hour: s.time,
                                }));
                              }}
                            >
                              Contact client
                            </Button>
                          )
                        }
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </Table>
        </Row>
      </Container>

      {/* Complete pending order payment modal */
        showPaymentModal && id !== -1 && (
          <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Client wallet balance</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='d-block text-center'>
                <h2>{props.clients.find(c => (c.client_id === (props.orders.find(o => o.order_id === id).client_id))).name + ' '
                  + props.clients.find(c => (c.client_id === (props.orders.find(o => o.order_id === id).client_id))).surname}</h2>
              </div>
              <div className="d-block text-center my-3">
                <h4 className="d-inline-block text-muted me-3">
                  Available wallet balance
                </h4>
                <h1 className="d-inline-block">
                  {props.clients.find(c => c.client_id === props.orders.find(o => o.order_id === id).client_id).budget.toFixed(2)}
                  €
                </h1>
              </div>
              <div className="d-block text-center my-3">
                <h4 className="d-inline-block text-muted me-3">
                  Total order price
                </h4>
                <h1 className="d-inline-block">
                  {props.orders.filter(o => o.order_id === id).reduce((a, b) => (parseFloat(a.OrderPrice) + parseFloat(b.OrderPrice))).toFixed(2)}
                  €
                </h1>
              </div>
              {props.clients.find(c => c.client_id === props.orders.find(o => o.order_id === id).client_id).budget < props.orders.filter(o => o.order_id === id).reduce((a, b) => (parseFloat(a.OrderPrice) + parseFloat(b.OrderPrice))) && (
                <div className="d-block text-danger text-center my-auto">
                  {dangerIcon} The client wallet balance is not enough to complete the payment of this order.<br />
                  Please top-up the client wallet and then confirm the payment.
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => setShowPaymentModal(false)}>
                Close
              </Button>
              <Button variant="success" disabled={props.clients.find(c => c.client_id === props.orders.find(o => o.order_id === id).client_id).budget < props.orders.filter(o => o.order_id === id).reduce((a, b) => (parseFloat(a.OrderPrice) + parseFloat(b.OrderPrice)))} onClick={() => { console.log('set true'); setPayOrder(true) }}>
                Confirm order payment
              </Button>
            </Modal.Footer>
          </Modal>
        )}

      <Finestra
        show={show}
        setShow={setShow}
        handleClose={handleClose}
        id={id}
        orders={props.orders}
        products={props.products}
      />
      <OrderStatus
        show={showOrderStatus}
        setShow={setShowOrderStatus}
        orders={props.orders}
        id={orderStatusID}
      />
      <ClientModal
        show={showClient}
        handleClose={handleClose}
        client={client}
        clients={props.clients}
      />
      <ContactModal
        notify={shouldBeNotified}
        show={showContact}
        handleClose={handleClose}
        client={client}
        clients={props.clients}
        contactType={contactType}
        pickUp={pickupDate}
      />
    </>
  );
}

/* order product list modal */
function Finestra(props) {
  const capitalizeEachFirstLetter = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
  };

  return (
    <Modal show={props.show} onHide={() => props.setShow(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Products in order #{props.id}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <ul className="list-group">
          {props.orders
            .filter((o) => o.order_id === props.id)
            .map((s) => (
              <li key={s.product_id} className="list-group-item">
                <div className="row">
                  <div className="col-md-1 mb-2 my-auto">
                    <img
                      className="w-100 shadow rounded-circle"
                      src={
                        process.env.PUBLIC_URL +
                        'products/' +
                        s.product_id +
                        '.jpg'
                      }
                      alt="Product img"
                    />
                  </div>
                  <div className="col-md-5 mb-2 text-start my-auto">
                    <h4>{capitalizeEachFirstLetter(s.product_name)}</h4>
                  </div>
                  <div className="col-md-3 mb-2 text-start my-auto">
                    {stockIcon} {s.order_quantity}{' '}
                    {props.products.find((p) => p.id === s.product_id).unit}
                  </div>
                  <div className="col-md-3 mb-2 text-start my-auto">
                    {priceIcon} {s.OrderPrice.toFixed(2)}€
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => props.setShow(false)}>Close product list</Button>
      </Modal.Footer>
    </Modal>
  );
}

/* insufficient balance modal*/
function ClientModal(props) {
  const [mailerState, setMailerState] = useState({
    email: '',
    message: '',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const handleSubmitEmail = (event) => {
    API.submitEmail(mailerState).then(() => {
      setEmailSent(true);
      setOpenDialog(false);
    });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  function changeEmailState(client) {
    setMailerState((prevState) => ({
      ...prevState,
      email: client.email,
      message: `Dear ${client.name} ${client.surname},\nYour order from Solidarity Purchase group is still pending, please top-up your wallet for letting us to complete your order\n\nBest Regards,\nSolidarity Purchase Group\n`,
    }));
  }
  return (
    <>
      <Modal
        size="md"
        show={props.show}
        onHide={props.handleClose}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Client Information</Modal.Title>
        </Modal.Header>

        {props.clients
          .filter((x) => x.client_id === props.client)
          .map((s) => (
            <Modal.Body key={s.id}>
              <Row>
                <div className="display-5 d-block text-center mb-2">{`${s.name} ${s.surname}`}</div>
              </Row>
              <span className="d-block text-center text-danger mb-3">
                {' '}
                This order is pending due to the insufficient balance. Select
                the way for contacting the Client{' '}
              </span>
              <hr />
              <Row className="mb-3">
                <Col sm={8}>
                  <h5>
                    <Telephone size={32} /> {` ${s.phone}`}
                  </h5>
                </Col>
                <Col sm={4}>
                  <div className="d-block text-end">
                    <Button variant="primary">Phone call</Button>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={8}>
                  <h5>
                    <Envelope size={32} />
                    {` ${s.email}`}
                  </h5>
                </Col>
                <Col sm={4}>
                  <div className="d-block text-end">
                    <Button
                      variant="primary"
                      disabled={emailSent}
                      onClick={() => {
                        changeEmailState(s);
                        handleOpenDialog();
                      }}
                    >
                      Send email
                    </Button>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
          ))}
      </Modal>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Send email'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to send an email to the Client about insufficient
            balance?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Disagree</Button>
          <Button onClick={handleSubmitEmail} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/* contact client modal */
function ContactModal(props) {
  const { contactType, pickUp, notify } = props;
  const [mailerState, setMailerState] = useState({
    email: '',
    message: '',
  });
  const handleSubmitEmail = (event) => {
    API.submitEmail(mailerState).then(() => {
      console.log('Mail sent correctly');
    });
  };

  return (
    <Modal
      size="md"
      show={props.show}
      onHide={props.handleClose}
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Client Information</Modal.Title>
      </Modal.Header>

      {props.clients
        .filter((x) => x.client_id === props.client)
        .map((s) => (
          <Modal.Body key={s.id}>
            <Row>
              <div className="display-5 d-block text-center mb-2">{`${s.name} ${s.surname}`}</div>
            </Row>
            <span className="d-block text-center text-danger mb-3">
              {' '}
              This order has not been picked up in time by the client. Send an
              email to the client to remind the missed pick-up.{' '}
            </span>
            <hr />
            <Row>
              <Form.Group>
                <div className="d-block text-center mb-2 lead">
                  Write an email to {s.email}:
                </div>

                <Form.Control
                  as="textarea"
                  size="lg"
                  rows={5}
                  value={mailerState.message}
                  onChange={(ev) => {
                    setMailerState((prevState) => ({
                      ...prevState,
                      email: s.email,
                      message: ev.target.value,
                    }));
                  }}
                ></Form.Control>
              </Form.Group>
              <div className="d-block text-center">
                {contactType === 0 && notify == 0 && (
                  <Button
                    variant="secondary"
                    className="mt-2"
                    onClick={() => {
                      setMailerState((prevState) => ({
                        ...prevState,
                        email: s.email,
                        message: `Dear ${s.name} ${s.surname}, \nYou didn't pick up your order at ${pickUp.date} ${pickUp.hour}.\nPlease contact us if there are any problems\n\nBest Regards,\nSolidarity Purchase Group\n`,
                      }));
                    }}
                  >
                    {' '}
                    Apply email template
                  </Button>
                )}
                {contactType === 1 && notify === 0 && (
                  <Button
                    variant="secondary"
                    className="mt-2"
                    onClick={() => {
                      setMailerState((prevState) => ({
                        ...prevState,
                        email: s.email,
                        message: `Dear ${s.name} ${s.surname},\nBest Regards,\nSolidarity Purchase Group\n`,
                      }));
                    }}
                  >
                    {' '}
                    Apply missed pick-up template
                  </Button>
                )}
                {notify === 1 && (
                  <Button
                    variant="secondary"
                    className="mt-2"
                    onClick={() => {
                      setMailerState((prevState) => ({
                        ...prevState,
                        email: s.email,
                        message: `Dear ${s.name} ${s.surname},\n\nTomorrow at ${pickUp.hour} you can pick up your order from our store. We kindly ask you to come and take your order.\nPlease inform us, if you wouldn't be available to arrive tomorrow (${pickUp.date} ${pickUp.hour})\n\nBest Regards,\nSolidarity Purchase Group\n`,
                      }));
                    }}
                  >
                    {' '}
                    Apply pick-up in the next 24h template
                  </Button>
                )}
              </div>
            </Row>
          </Modal.Body>
        ))}
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={() => {
            setMailerState((prevState) => ({
              ...prevState,
              email: '',
              message: '',
            }));
            props.handleClose();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            handleSubmitEmail();
          }}
        >
          Send Email
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

/* order status modal */
function OrderStatus(props) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let min = 1000;
    let orderStatus = null;

    props.orders
      .filter((o) => o.order_id === props.id)
      .forEach((item) => {
        const type = item.pickup === 0 ? 'delivery' : 'pick-up';
        let orderStatusLocal = null;

        if (item.state === 'missed') {
          orderStatusLocal = getOrderStatus('missed', type);
        } else if (item.state === 'pending') {
          orderStatusLocal = getOrderStatus('pending', type);
        } else if (item.state === 'booked' && item.farmer_state === null) {
          orderStatusLocal = getOrderStatus('booked', type);
        } else if (item.state === 'booked' && item.farmer_state === 'confirmed') {
          orderStatusLocal = getOrderStatus('booked', type);
        } else if (item.state === 'booked' && item.farmer_state === 'farmer-shipped') {
          orderStatusLocal = getOrderStatus('farmer-shipped', type);
        } else if (item.state === 'received') {
          orderStatusLocal = getOrderStatus('received', type);
        } else if (item.state === 'prepared') {
          orderStatusLocal = getOrderStatus('prepared', type);
        } else if (item.state === 'shipped') {
          orderStatusLocal = getOrderStatus('shipped', type);
        } else if (item.state === 'delivered') {
          orderStatusLocal = getOrderStatus('delivered', type);
        }

        if (orderStatusLocal.num_steps < min) {
          orderStatus = orderStatusLocal;
          min = orderStatusLocal.num_steps;
        }
      });

    setStatus(orderStatus);
  }, [props.id]);

  const getOrderStatus = (status, type) => {
    const orderStatus = {
      order_completed: false,
      order_steps: 0,
      delivery_type: '',
      client: { payed: false, missed: false },
      farmer: { shipped: false },
      warehouse: { received: false, prepared: false },
      delivery: { picked_up: false, shipped: false, delivered: false },
    };

    orderStatus.delivery_type = type;

    if (status === 'missed') {
      orderStatus.client.missed = true;
      orderStatus.num_steps = -1;
    } else if (status === 'pending') {
      orderStatus.client.payed = false;
      orderStatus.num_steps = 0;
    } else if (status === 'booked') {
      orderStatus.client.payed = true;
      orderStatus.num_steps = 1;
    } else if (status === 'farmer-shipped') {
      orderStatus.client.payed = true;
      orderStatus.farmer.shipped = true;
      orderStatus.num_steps = 2;
    } else if (status === 'received') {
      orderStatus.client.payed = true;
      orderStatus.farmer.shipped = true;
      orderStatus.warehouse.received = true;
      orderStatus.num_steps = 3;
    } else if (status === 'prepared') {
      orderStatus.client.payed = true;
      orderStatus.farmer.shipped = true;
      orderStatus.warehouse.received = true;
      orderStatus.warehouse.prepared = true;
      orderStatus.num_steps = 4;
    } else if (type === 'pick-up') {
      if (status === 'delivered') {
        orderStatus.client.payed = true;
        orderStatus.farmer.shipped = true;
        orderStatus.warehouse.received = true;
        orderStatus.warehouse.prepared = true;
        orderStatus.delivery.delivered = true;
        orderStatus.order_completed = true;
        orderStatus.num_steps = 5;
      }
    } else if (type === 'delivery') {
      if (status === 'shipped') {
        orderStatus.client.payed = true;
        orderStatus.farmer.shipped = true;
        orderStatus.warehouse.received = true;
        orderStatus.warehouse.prepared = true;
        orderStatus.delivery.shipped = true;
        orderStatus.num_steps = 5;
      } else if (status === 'delivered') {
        orderStatus.client.payed = true;
        orderStatus.farmer.shipped = true;
        orderStatus.warehouse.received = true;
        orderStatus.warehouse.prepared = true;
        orderStatus.delivery.shipped = true;
        orderStatus.delivery.delivered = true;
        orderStatus.order_completed = true;
        orderStatus.num_steps = 6;
      }
    } else {
      console.error('INVALID ORDER STATUS ' + status + ' ' + type);
    }

    return orderStatus;
  };

  return (
    <Modal show={props.show} onHide={() => props.setShow(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title></Modal.Title>
      </Modal.Header>

      {status && (
        <Modal.Body>
          <div className="row">
            <div className="col-lg-6 display-6">Order history</div>
            <div className="col-lg-6">
              <h5 className="d-block mt-2 mb-0 me-2 text-end">
                <Badge bg={status.order_completed ? 'success' : 'danger'}>
                  {status.order_completed
                    ? 'Order completed'
                    : 'Order not yet completed'}
                </Badge>
              </h5>
            </div>
          </div>

          {!status.client.missed && (
            <>
              <div className="row">
                <span className="d-block lead mt-2">
                  <span className="text-success">{verticalIcon}</span> Client
                </span>
                <div className="d-block text-success fw-bold">
                  {completedIcon} Order placed
                </div>
                {status.client.payed && (
                  <span className="d-block text-success">{verticalIcon}</span>
                )}
                {!status.client.payed && (
                  <span className="d-block text-secondary">{verticalIcon}</span>
                )}
                {status.client.payed && (
                  <div className="d-block text-success fw-bold">
                    {completedIcon} Payment completed
                  </div>
                )}
                {!status.client.payed && (
                  <div className="d-block text-danger fw-bold">
                    {errorIcon} Payment pending
                  </div>
                )}
              </div>
              <div className="row">
                {status.client.payed && status.farmer.shipped && (
                  <span className="d-block lead mt-2">
                    <span className="text-success">{verticalIcon}</span> Farmer
                  </span>
                )}
                {(!status.client.payed || !status.farmer.shipped) && (
                  <span className="d-block lead mt-2">
                    <span className="text-secondary">{verticalIcon}</span>{' '}
                    Farmer
                  </span>
                )}
                {status.farmer.shipped && (
                  <div className="d-block text-success fw-bold">
                    {completedIcon} All farmers have shipped the products
                  </div>
                )}
                {!status.farmer.shipped && (
                  <div className="d-block text-secondary">
                    {incompletedIcon} All farmers have shipped the products
                  </div>
                )}
              </div>
              <div className="row">
                {status.farmer.shipped && status.warehouse.received && (
                  <span className="d-block lead mt-2">
                    <span className="text-success">{verticalIcon}</span>{' '}
                    Warehouse
                  </span>
                )}
                {(!status.farmer.shipped || !status.warehouse.received) && (
                  <span className="d-block lead mt-2">
                    <span className="text-secondary">{verticalIcon}</span>{' '}
                    Warehouse
                  </span>
                )}

                {status.warehouse.received && (
                  <div className="d-block text-success fw-bold">
                    {completedIcon} Farmer shipment has been received by the
                    warehouse
                  </div>
                )}
                {!status.warehouse.received && (
                  <div className="d-block text-secondary">
                    {incompletedIcon} Farmer shipment has been received by the
                    warehouse
                  </div>
                )}

                {status.warehouse.received && status.warehouse.prepared && (
                  <span className="d-block text-success">{verticalIcon}</span>
                )}
                {(!status.warehouse.received || !status.warehouse.prepared) && (
                  <span className="d-block text-secondary">{verticalIcon}</span>
                )}

                {status.warehouse.prepared && (
                  <div className="d-block text-success fw-bold">
                    {completedIcon} Order has been prepared by the warehouse
                  </div>
                )}
                {!status.warehouse.prepared && (
                  <div className="d-block text-secondary">
                    {incompletedIcon} Order has been prepared by the warehouse
                  </div>
                )}
              </div>
              <div className="row">
                {status.warehouse.prepared &&
                  status.delivery_type === 'pick-up' &&
                  status.delivery.delivered && (
                    <span className="d-block lead mt-2">
                      <span className="text-success">{verticalIcon}</span>{' '}
                      Delivery
                    </span>
                  )}
                {status.delivery_type === 'pick-up' &&
                  (!status.warehouse.prepared ||
                    !status.delivery.delivered) && (
                    <span className="d-block lead mt-2">
                      <span className="text-secondary">{verticalIcon}</span>{' '}
                      Delivery
                    </span>
                  )}

                {status.delivery_type === 'pick-up' &&
                  status.delivery.delivered && (
                    <div className="d-block text-success fw-bold">
                      {completedIcon} Client has picked up the order
                    </div>
                  )}
                {status.delivery_type === 'pick-up' &&
                  !status.delivery.delivered && (
                    <div className="d-block text-secondary">
                      {incompletedIcon} Client has picked up the order
                    </div>
                  )}

                {status.warehouse.prepared &&
                  status.delivery_type === 'delivery' &&
                  status.delivery.shipped && (
                    <span className="d-block lead mt-2">
                      <span className="text-success">{verticalIcon}</span>{' '}
                      Delivery
                    </span>
                  )}
                {status.delivery_type === 'delivery' &&
                  (!status.warehouse.prepared || !status.delivery.shipped) && (
                    <span className="d-block lead mt-2">
                      <span className="text-secondary">{verticalIcon}</span>{' '}
                      Delivery
                    </span>
                  )}

                {status.delivery_type === 'delivery' &&
                  status.delivery.shipped && (
                    <div className="d-block text-success fw-bold">
                      {completedIcon} Order has been shipped
                    </div>
                  )}
                {status.delivery_type === 'delivery' &&
                  !status.delivery.shipped && (
                    <div className="d-block text-secondary">
                      {incompletedIcon} Order has been shipped
                    </div>
                  )}

                {status.delivery_type === 'delivery' &&
                  status.delivery.shipped &&
                  status.delivery.delivered && (
                    <span className="d-block text-success">{verticalIcon}</span>
                  )}
                {status.delivery_type === 'delivery' &&
                  (!status.delivery.shipped || !status.delivery.delivered) && (
                    <span className="d-block text-secondary">
                      {verticalIcon}
                    </span>
                  )}

                {status.delivery_type === 'delivery' &&
                  status.delivery.delivered && (
                    <div className="d-block text-success fw-bold">
                      {completedIcon} Order successfully delivered
                    </div>
                  )}
                {status.delivery_type === 'delivery' &&
                  !status.delivery.delivered && (
                    <div className="d-block text-secondary">
                      {incompletedIcon} Order successfully delivered
                    </div>
                  )}
              </div>
            </>
          )}
          {status.client.missed && (
            <div className="row">
              <div className="d-block lead fw-bold text-center text-danger my-5">
                {dangerIcon} Client has missed the order!
              </div>
            </div>
          )}
        </Modal.Body>
      )}
      <Modal.Footer>
        <Button onClick={() => props.setShow(false)}>
          Close order history
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const stockIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-boxes"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434L7.752.066ZM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567L4.25 7.504ZM7.5 9.933l-2.75 1.571v3.134l2.75-1.571V9.933Zm1 3.134 2.75 1.571v-3.134L8.5 9.933v3.134Zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567-2.742 1.567Zm2.242-2.433V3.504L8.5 5.076V8.21l2.75-1.572ZM7.5 8.21V5.076L4.75 3.504v3.134L7.5 8.21ZM5.258 2.643 8 4.21l2.742-1.567L8 1.076 5.258 2.643ZM15 9.933l-2.75 1.571v3.134L15 13.067V9.933ZM3.75 14.638v-3.134L1 9.933v3.134l2.75 1.571Z"
    />
  </svg>
);

const priceIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-tag"
    viewBox="0 0 16 16"
  >
    <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z" />
    <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z" />
  </svg>
);

const incompletedIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-circle"
    viewBox="0 0 16 16"
  >
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
  </svg>
);

const completedIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-check-circle"
    viewBox="0 0 16 16"
  >
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
  </svg>
);

const errorIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-exclamation-circle"
    viewBox="0 0 16 16"
  >
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
  </svg>
);

const verticalIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-three-dots-vertical"
    viewBox="0 0 16 16"
  >
    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
  </svg>
);

const dangerIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-exclamation-triangle"
    viewBox="0 0 16 16"
  >
    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
  </svg>
);

export default DeliverList;
