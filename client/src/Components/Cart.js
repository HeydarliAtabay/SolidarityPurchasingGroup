import { React, useEffect, useState } from 'react'
import { Button, Form, Tooltip, OverlayTrigger, Tabs, Tab, Row, Col, ListGroup, Alert } from 'react-bootstrap'
import { Country, City } from 'country-state-city';
import { useHistory } from 'react-router-dom';
import { clientOrders } from '../classes/ClientOrder';
import API from '../API'
import dayjs from 'dayjs'

var isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)

dayjs.Ls.en.weekStart = 1;

function Cart(props) {

  const history = useHistory();

  const [clientID, setClientID] = useState(props.userRole === 'client' ? props.clientid : -1);
  const [client, setClient] = useState(null);
  const [updateItems, setUpdateItems] = useState(true);
  const [items, setItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderArray, setOrderArray] = useState([]);
  const [placeOrder, setPlaceOrder] = useState(false);
  const [orderAlert, setOrderAlert] = useState(null);
  const [emailAlert, setEmailAlert] = useState(null);
  const [telegramAlert, setTelegramAlert] = useState(null);

  const [address, setAddress] = useState('');
  const [nation, setNation] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [zipCode, setZipCode] = useState('');

  const [deliveryFlag, setDeliveryFlag] = useState('delivery');
  const [pickupDay, setPickupDay] = useState(2);
  const [pickupTime, setPickupTime] = useState('10:00');

  const [shippingError, setShippingError] = useState('');

  const [sendEmail, setSendEmail] = useState(false);
  const [sendTelegram, setSendTelegram] = useState(false);
  const [resendEmail, setResendEmail] = useState(false);

  // let location = useLocation();

  useEffect(() => {
    if (!placeOrder) {
      return;
    }

    const submitOrder = async () => {
      try {

        for (const ord of orderArray) {
          await API.addOrder(ord);
        }
        if (orderTotal <= client.budget) {
          await API.increaseBalance(orderTotal * (-1), clientID);
        }

        setOrderAlert({ variant: 'success', msg: 'Order has been successfully placed.' });

        if (sendEmail) {
          let mailObj = {
            email: client.email,
            message: ''
          };
          if (orderTotal > client.budget) {
            mailObj.message = "Dear " + client.name + " " + client.surname + ",\nYour order from Solidarity Purchase group was placed but is pending and awaiting payment due to insufficient wallet balance.\nPlease contact the shop to top-up your wallet.\n\nKind regards\nSPG";
          }
          else {
            if (deliveryFlag === 'delivery') {
              mailObj.message = "Dear " + client.name + " " + client.surname + ",\nYour order from Solidarity Purchase group was placed and the payment was successfully processed.\nYou will be notified again when your order is ready to be delivered.\n\nKind regards\nSPG";
            }
            else {
              mailObj.message = "Dear " + client.name + " " + client.surname + ",\nYour order from Solidarity Purchase group was placed and the payment was successfully processed.\nYou will be notified again 24h before the chosen pickup date.\n\nKind regards\nSPG";
            }
          }
          const res = await API.submitEmail(mailObj);
          if (res.status === 'success') {
            setEmailAlert({ variant: 'success', msg: 'Confirmation email successfully sent to ' + client.email });
          }
          else {
            setEmailAlert({ variant: 'danger', msg: 'Oops! Could not send the confirmation email. Click the button below to try again.' });
          }
        }

        if (sendTelegram) {
          if (orderTotal > client.budget) {
            await API.sendTelegramOrderStateNotification(clientID, 'placed');
          }
          else {
            await API.sendTelegramOrderStateNotification(clientID, 'pending');
          }
          setTelegramAlert({ variant: 'success', msg: 'Telegram notification successfully sent to ' + client.email })
        }

        setPlaceOrder(false);

        let cart = props.cartItems;
        cart.delete(clientID);
        props.setCartItems(cart);
        props.setCartUpdated(true);
        props.setRecharged(true);
        props.setRecharged1(true);
        setUpdateItems(true);
      }
      catch (error) {
        console.log(error);
        setPlaceOrder(false);
        props.setRecharged(true);
        props.setRecharged1(true);
        setOrderAlert({ variant: 'danger', msg: 'Oops! Could not place the order. Please try again.' });
      }
    }

    submitOrder();
  }, [placeOrder]);

  useEffect(() => {
    if (!resendEmail) {
      return;
    }

    const submitOrder = async () => {

      let mailObj = {
        email: client.email,
        message: ''
      };
      if (orderTotal > client.budget) {
        mailObj.message = "Dear " + client.name + " " + client.surname + ",\nYour order from Solidarity Purchase group was placed but is pending and awaiting payment due to insufficient wallet balance.\nPlease contact the shop to top-up your wallet.\n\nKind regards\nSPG";
      }
      else {
        if (deliveryFlag === 'delivery') {
          mailObj.message = "Dear " + client.name + " " + client.surname + ",\nYour order from Solidarity Purchase group was placed and the payment was successfully processed.\nYou will be notified again when your order is ready to be delivered.\n\nKind regards\nSPG";
        }
        else {
          mailObj.message = "Dear " + client.name + " " + client.surname + ",\nYour order from Solidarity Purchase group was placed and the payment was successfully processed.\nYou will be notified again 24h before the chosen pickup date.\n\nKind regards\nSPG";
        }
      }
      const res = await API.submitEmail(mailObj);
      if (res.status === 'success') {
        setEmailAlert({ variant: 'success', msg: 'Confirmation email successfully sent to ' + client.email });
      }
      else {
        setEmailAlert({ variant: 'danger', msg: 'Oops! Could not send the confirmation email. Click the button below to try again.' });
      }
      setResendEmail(false);
    }

    submitOrder();
  }, [resendEmail])

  /*needs to be merged with below useEffect*/
  useEffect(() => {
    if (parseInt(clientID) === -1) {
      setClient(null);
      setOrderTotal(0);
      setItems([]);
      return;
    }

    if (props.clients.find((client) => (client.client_id === parseInt(clientID)))) {
      setClient(props.clients.find((client) => (client.client_id === parseInt(clientID))));
    }
    else {
      setClient(null);
      setOrderTotal(0);
      setItems([]);
      return;
    }

    if (props.cartItems.has(clientID)) {
      const items = props.cartItems.get(clientID).items;
      setItems(items);

      let sum = 0;
      items.forEach((item) => {
        sum += item.buyQty * item.price;
      });
      setOrderTotal(sum.toFixed(2));
      return;
    }

    setOrderTotal(0);
    setItems([]);

  }, [clientID]);

  /*needs to be merged with above useEffect*/
  useEffect(() => {
    if (!updateItems) {
      return;
    }

    setUpdateItems(false);

    if (props.cartItems.has(clientID)) {
      const items = props.cartItems.get(clientID).items;
      setItems(items);

      let sum = 0;
      items.forEach((item) => {
        sum += item.buyQty * item.price;
      });
      setOrderTotal(sum.toFixed(2));
      return;
    }

    setOrderTotal(0);
    setItems([]);

  }, [updateItems]);

  const checkPlaceOrder = () => {
    let orderItems = [];
    let indexInc = 1;
    if (deliveryFlag === 'delivery') {
      if (address.trim().length === 0) {
        setShippingError('Please fill in the delivery address');
        return;
      }
      if (nation.trim().length === 0) {
        setShippingError('Please fill in the delivery country');
        return;
      }
      if (city.trim().length === 0) {
        setShippingError('Please fill in the delivery city');
        return;
      }
      if (zipCode.trim().length === 0) {
        setShippingError('Please fill in the delivery zip code');
        return;
      }
      if (date.trim().length === 0) {
        setShippingError('Please fill in the delivery date');
        return;
      }
      if (time.trim().length === 0) {
        setShippingError('Please fill in the delivery time');
        return;
      }
      setShippingError('');
      items.forEach((item) => {
        orderItems.push({
          order_id: props.orders.length > 0 ? Math.max(...props.orders.map((o) => (o.order_id))) + 1 : 1,
          client_id: clientID,
          product_name: item.name,
          product_id: item.id,
          order_quantity: item.buyQty,
          state: orderTotal > client.budget ? 'pending' : 'booked',
          farmer_state: null,
          OrderPrice: item.buyQty * item.price,
          id: props.orders.length > 0 ? Math.max(...props.orders.map((o) => (o.id))) + indexInc : indexInc,
          address: address,
          city: city,
          nation: Country.getCountryByCode(nation).name,
          zipcode: zipCode,
          date: date,
          time: time,
          pickup: 0
        });
        indexInc++;
      });
    }
    else {
      if (pickupDay !== 2 && pickupDay !== 3 && pickupDay !== 4) {
        setShippingError('Please select a day for the pick-up');
        return;
      }
      if (pickupTime.trim().length === 0 || !dayjs(props.time.date + ' ' + pickupTime).isBetween(props.time.date + ' 08:00', props.time.date + ' 18:00', null, '[]')) {
        setShippingError('Please select a time between 08:00 and 18:00 for the pick-up');
        return;
      }
      setShippingError('');
      items.forEach((item) => {
        orderItems.push({
          order_id: props.orders.length > 0 ? Math.max(...props.orders.map((o) => (o.order_id))) + 1 : 1,
          client_id: clientID,
          product_name: item.name,
          product_id: item.id,
          order_quantity: item.buyQty,
          state: orderTotal > client.budget ? 'pending' : 'booked',
          farmer_state: null,
          OrderPrice: item.buyQty * item.price,
          id: props.orders.length > 0 ? Math.max(...props.orders.map((o) => (o.id))) + indexInc : indexInc,
          address: '',
          city: '',
          nation: '',
          zipcode: '',
          date: dayjs(props.time.date).add(1, 'week').weekday(pickupDay).format('YYYY-MM-DD'),
          time: pickupTime,
          pickup: 1
        });
        indexInc++;
      });
    }

    setOrderArray(orderItems);
    setPlaceOrder(true);
  }

  const incrementQuantity = (product, qty) => {
    let cart = props.cartItems;
    let clientCart = cart.get(clientID).items;
    let cartItemIndex = clientCart.findIndex((item) => (item.id === product.id));
    if (cartItemIndex !== -1) {
      if (clientCart[cartItemIndex].buyQty + qty > product.quantity) {
        cart.get(clientID).items[cartItemIndex].buyQty = product.quantity;
      }
      else {
        cart.get(clientID).items[cartItemIndex].buyQty += qty;
      }
    }
    else {
      if (qty > product.quantity) {
        qty = product.quantity;
      }
      product.buyQty = qty;
      cart.get(clientID).items.push(product);
    }
    props.setCartItems(cart);
    setUpdateItems(true);
  }

  const decrementQuantity = (product, qty) => {
    let cart = props.cartItems;
    let clientCart = cart.get(clientID).items;
    let cartItemIndex = clientCart.findIndex((item) => (item.id === product.id));
    if (cartItemIndex !== -1) {
      if (clientCart[cartItemIndex].buyQty - qty <= 0) {
        cart.get(clientID).items[cartItemIndex].buyQty = 0.5;
      }
      else {
        cart.get(clientID).items[cartItemIndex].buyQty -= qty;
      }
    }
    props.setCartItems(cart);
    setUpdateItems(true);
  }

  const removeItem = (productID) => {
    let cart = props.cartItems;
    cart.get(clientID).items = cart.get(clientID).items.filter((item) => (item.id !== productID));
    props.setCartItems(cart);
    props.setCartUpdated(true);
    setUpdateItems(true);
  }

  const capitalizeEachFirstLetter = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
  };

  return (
    <>
      <div className='container-fluid'>
        <div className="row">
          <div className="d-block text-center">
            <span className="d-block text-center mt-3 mb-5 display-2">Shopping cart</span>
          </div>
          {props.userRole === 'employee' && (
            < div className='d-block text-center'>
              <div className="row">
                <div className='col-lg-4'></div>
                <div className='col-lg-4 mb-3'>
                  <Form.Select className="mx-2 d-inline-block w-50" value={clientID} onChange={(event) => (setClientID(event.target.value))} aria-label="Default select example">
                    <option value="-1">Select a client</option>
                    {Array.from(props.cartItems.keys()).map(key => (
                      <option key={key} value={key}>{props.clients.find(c => c.client_id === parseInt(key)).name} {props.clients.find(c => c.client_id === parseInt(key)).surname}</option>
                    ))}
                  </Form.Select>
                  <OverlayTrigger
                    placement="auto"
                    className="d-inline-block w-25"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip>
                        Only clients for which items<br />
                        were booked are shown.
                      </Tooltip>}
                  >
                    {infoIcon}
                  </OverlayTrigger></div>
                <div className='col-lg-4'></div>
              </div>
            </div>
          )}

          <div className='col-lg-3'></div>
          <div className='col-lg-6 mb-5'>
            {orderAlert && (
              <Alert
                variant={orderAlert.variant}
                dismissible={true}
                onClose={() => setOrderAlert(null)}
              >
                {orderAlert.msg}
                {orderAlert.variant === 'success' && (
                  <div className='d-block text-end'>
                    {props.userRole === 'client' && <Button variant='outline-light' onClick={() => (history.push("/orders"))}>Go to My orders</Button>}
                  </div>
                )}
              </Alert>
            )}
            {emailAlert && (
              <Alert
                variant={emailAlert.variant}
                dismissible={true}
                onClose={() => setEmailAlert(null)}
              >
                {emailAlert.msg}
                {emailAlert.variant === 'danger' && (
                  <div className='d-block text-end'>
                    <Button variant='outline-danger' onClick={() => (setResendEmail(true))}>Resend email</Button>
                  </div>
                )}
              </Alert>
            )}
            {telegramAlert && (
              <Alert
                variant={telegramAlert.variant}
                dismissible={true}
                onClose={() => setTelegramAlert(null)}
              >
                {telegramAlert.msg}
              </Alert>
            )}
            <ul className="list-group mb-3">
              {client && (
                <li className="list-group-item shadow bg-light">
                  <div className='d-block text-center'>
                    <h4 className='d-inline-block text-muted me-3'>Available wallet balance</h4>
                    <h1 className='d-inline-block'>{client.budget.toFixed(2)}€</h1>
                  </div>
                  {orderTotal > client.budget && (
                    <div className='d-block text-center text-muted'>
                      You can still place an order even if your Order Total is higher than you currently available budget.<br />
                      The order will be marked as <b>pending</b> and it will be confirmed as soon as you top-up your wallet.
                    </div>
                  )}
                </li>
              )}
              {parseInt(clientID) !== -1 && items.map((item) => (
                <li key={item.id} className="list-group-item shadow">
                  <div className="row">
                    <div className="col-md-2 mb-2 my-auto align-middle">
                      <img
                        className="w-100 shadow rounded-circle"
                        src={
                          process.env.PUBLIC_URL +
                          'products/' +
                          item.id +
                          '.jpg'
                        }
                        alt="Product img"
                      />
                    </div>
                    <div className="col-md-6 mb-2 text-start mt-2">
                      <div className='d-block'>
                        <h4>{capitalizeEachFirstLetter(item.name)}</h4>
                      </div>
                      <div className='d-block'>
                        {stockIcon} {item.quantity} {item.unit} available
                      </div>
                      <div className='d-block'>
                        {priceIcon} {item.price}€ / {item.unit}
                      </div>
                    </div>
                    <div className="col-md-4 mb-2 my-auto align-middle">

                      <div className="d-block w-100 px-1 my-2">
                        <Button variant="danger" className="w-100" onClick={() => (removeItem(item.id))}>
                          Remove from cart
                        </Button>
                      </div>
                      <div className="d-block w-100">
                        <div className='d-inline-block my-1 px-1 w-25'>
                          <Button variant="secondary" className="w-100" onClick={() => (decrementQuantity(item, 0.5))}>-</Button>
                        </div>
                        <div className='d-inline-block my-1 px-1 w-50'>
                          <Form.Control type="text" className="w-100 text-center" value={item.buyQty + " " + item.unit} onChange={() => { return; }} />
                        </div>
                        <div className='d-inline-block my-1 px-1 w-25'>
                          <Button variant="primary" className="w-100" onClick={() => (incrementQuantity(item, 0.5))}>+</Button>
                        </div>
                      </div>
                      <div className='d-block w-100 px-1'>
                        <Form.Control type="text" className="w-100 text-center" value={"Item total price: " + (item.buyQty * item.price).toFixed(2) + "€"} onChange={() => { return; }} />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {parseInt(clientID) !== -1 && items.length > 0 && (
                <li className="list-group-item shadow bg-light">
                  <div className='d-block text-end'>
                    <h4 className='d-inline-block text-muted me-3'>Order total</h4>
                    <h1 className='d-inline-block'>{orderTotal}€</h1>
                  </div>
                </li>
              )}
            </ul>
            {parseInt(clientID) === -1 && (
              <div className='d-block mb-3 p-5 text-center rounded border shadow'>
                Please select a client from the dropdown above.
              </div>
            )}
            {parseInt(clientID) !== -1 && items.length === 0 && (
              <div className='d-block mb-3 p-5 text-center rounded border shadow'>
                {props.userRole === 'client' && "Your cart is empty"}
                {props.userRole === 'employee' && "The selected client's cart is empty"}
              </div>
            )}
            {parseInt(clientID) !== -1 && items.length > 0 && (
              <div className="d-block mb-3 p-3 rounded border shadow">
                <div className="d-block text-center">
                  <span className="d-block text-center my-1 display-6">Choose shipping mode</span>
                </div>
                <Tabs
                  defaultActiveKey="delivery"
                  className="mb-3"
                  activeKey={deliveryFlag}
                  onSelect={(k) => {
                    console.log(k);
                    setDeliveryFlag(k);
                  }}
                >
                  <Tab eventKey="delivery" title="Home delivery">
                    <Form>
                      <Row className="mb-3">
                        <Form.Group controlId="formGridAddress1">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            value={address}
                            onChange={(ev) => {
                              setAddress(ev.target.value);
                            }}
                          />
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Col lg={4}>
                          <Form.Group controlId="formGridState">
                            <Form.Label>Country</Form.Label>
                            <Form.Select value={nation} className="mb-3" onChange={(event) => (setNation(event.target.value))}>
                              <option value="-1">Country</option>
                              {Country.getAllCountries().map((c) => (
                                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        <Col lg={4}>
                          <Form.Group controlId="formGridCity">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              value={city}
                              onChange={(ev) => {
                                setCity(ev.target.value);
                              }}
                            />
                          </Form.Group>
                        </Col>

                        <Col lg={4}>
                          <Form.Group controlId="formGridZip">
                            <Form.Label>Zip code</Form.Label>
                            <Form.Control
                              value={zipCode}
                              onChange={(ev) => {
                                setZipCode(ev.target.value);
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col lg={4}>
                          <Form.Group>
                            <Form.Label as="h6">Delivery date</Form.Label>
                            <Form.Control type="date" min={dayjs(props.time.date).add(1, 'week').day(2).format('YYYY-MM-DD')} max={dayjs(props.time.date).add(1, 'week').day(4).format('YYYY-MM-DD')} value={date} onChange={(ev) => setDate(ev.target.value)} />
                          </Form.Group>
                        </Col>
                        <Col lg={4}>
                          <Form.Group>
                            <Form.Label as="h6">Delivery date</Form.Label>
                            <Form.Control type="time" value={time} min='08:00' max='18:00' onChange={(ev) => setTime(ev.target.value)} />
                          </Form.Group>
                        </Col>
                        <Col lg={4}></Col>
                      </Row>
                    </Form>
                  </Tab>
                  <Tab eventKey="pickup" title="In shop pickup">
                    <h5 className="text-center my-3">
                      Select the day and the time for the pickup
                    </h5>
                    <div className="row">
                      <div className="col-md-6 text-center">
                        <ListGroup as="ul">
                          <ListGroup.Item
                            as="li"
                            active={pickupDay === 2}
                            onClick={() => setPickupDay(2)}
                          >
                            Next wednesday
                          </ListGroup.Item>
                          <ListGroup.Item
                            as="li"
                            active={pickupDay === 3}
                            onClick={() => setPickupDay(3)}
                          >
                            Next thursday
                          </ListGroup.Item>
                          <ListGroup.Item
                            as="li"
                            active={pickupDay === 4}
                            onClick={() => setPickupDay(4)}
                          >
                            Next friday
                          </ListGroup.Item>
                        </ListGroup>
                      </div>
                      <div className="col-md-6 text-center my-auto">
                        <div className="d-block text-center fw-bold">
                          Shop times: 08:00 - 18:00
                        </div>
                        <Form.Group>
                          <Form.Control
                            required
                            type="time"
                            min="08:00"
                            max="18:00"
                            value={pickupTime}
                            onChange={(event) => {
                              setPickupTime(event.target.value);
                            }}
                          />
                        </Form.Group>
                      </div>
                    </div>
                    <div className="d-block text-center my-3">
                      Selected pickup time:{' '}
                      {dayjs(props.time.date)
                        .add(1, 'week')
                        .weekday(pickupDay)
                        .format('dddd, MMMM D, YYYY')}{' '}
                      at {pickupTime}
                    </div>
                  </Tab>
                  {shippingError !== '' && (
                    <div className='d-block text-danger text-center my-2'>
                      {shippingError}
                    </div>
                  )}
                </Tabs>
              </div>
            )}
            <div className="d-block p-3 rounded border shadow">
              <div className="row">
                <div className='col-lg-9'>
                  <div className='row'>
                    <div className='col-lg-6'>
                      <h5 className='d-inline-block text-muted me-3'>Available budget</h5>
                      <h3 className='d-inline-block'>{client ? client.budget.toFixed(2) : 0}€</h3>
                    </div>
                    <div className='col-lg-6'>
                      <h5 className='d-inline-block text-muted me-3'>Order total</h5>
                      <h3 className='d-inline-block'>{orderTotal}€</h3>
                    </div>
                  </div>
                  {client && orderTotal > client.budget && (
                    <div className='d-block text-danger text-center'>
                      {dangerIcon} Order will be placed as <b>pending</b> due to unsufficient balance.
                    </div>
                  )}
                  <hr />
                  <div className='d-block'>
                    <Form.Check
                      type="switch"
                      checked={sendEmail}
                      onChange={() => (setSendEmail((send) => (!send)))}
                      id="custom-switch"
                      label={props.userRole === 'client' ? "Receive a confirmation email for the purchase" : "Send confirmation email for the purchase to the client"}
                    />
                  </div>
                  <div className='d-block'>
                    <Form.Check
                      type="switch"
                      disabled={client && (client.telegramId === '' || client.telegramId === null)}
                      checked={sendTelegram}
                      onChange={() => (setSendTelegram((send) => (!send)))}
                      id="custom-switch"
                      label={props.userRole === 'client' ? "Receive a telegram notification for the purchase" : "Send telegram notification for the confirmation of the purchase to the client"}
                    />
                  </div>
                </div>
                <div className='col-lg-3 text-center my-auto'>
                  <Button variant="secondary" className="py-3 mb-2 w-100" onClick={() => (props.userRole === 'client' ? history.push("/booking") : history.push("/staff-booking"))}>Continue shopping</Button>
                  <Button variant="success" className="py-3 w-100" disabled={placeOrder || parseInt(clientID) === -1} onClick={() => (!placeOrder && checkPlaceOrder())}>{placeOrder ? "Placing order..." : "Place order"}</Button>
                </div>
              </div>
            </div>
          </div>

          <div className='col-lg-3'></div>

        </div>
      </div>
    </>
  )
}

const infoIcon = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
</svg>

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

const priceIcon = (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-tag" viewBox="0 0 16 16">
  <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z" />
  <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z" />
</svg>)

const dangerIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle" viewBox="0 0 16 16">
  <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
  <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
</svg>

export default Cart;
