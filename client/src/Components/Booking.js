import {
  Button,
  Row,
  Col,
  Card,
  Container,
  Modal,
  Dropdown,
  Form,
  Tabs,
  Tab,
  ListGroup,
} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from './../API';
import Basket from './Basket';
import ProductPage from './ProductPage';
import { useHistory, useLocation } from 'react-router-dom';
import { clientOrders } from '../classes/ClientOrder';
import dayjs from 'dayjs';
import { useMediaQuery } from 'react-responsive';

var weekday = require('dayjs/plugin/weekday');
dayjs.extend(weekday);

dayjs.Ls.en.weekStart = 1;

function Booking(props) {
  const history = useHistory();
  const location = useLocation();

  const [productsBasket, setProductsBasket] = useState([]);
  const [showProductDetailsModal, setShowProductDetailsModal] = useState(false);
  const [currentProductDetails, setCurrentProductDetails] = useState();
  const [showCompletePurchase, setShowCompletePurchase] = useState(false);
  const [address, setAddress] = useState('');
  const [nation, setNation] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [completeAddressing, setCompleteAddressing] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [deliveryFlag, setDeliveryFlag] = useState('delivery');
  const [pickupDay, setPickupDay] = useState(2);
  const [pickupTime, setPickupTime] = useState('10:00');

  const isBigScreen = useMediaQuery({ query: '(min-width: 1225px)' });
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

  console.log(time + ' ' + date);
  console.log(pickupDay + ' ' + pickupTime);

  let rows = [
    ...Array(Math.ceil(products.filter((p) => p && p.active === 1).length / 3)),
  ];
  let productRows = Array(rows.length);

  const itemsPrice = productsBasket.reduce((a, c) => a + c.price * c.qty, 0); //a=accumulator c=current, so it computes the total

  const [showsuccess, setShowsuccess] = useState(false);
  const [showdanger, setShowdanger] = useState(false);
  const [showUpdateError, setShowUpdateError] = useState(false);
  const [showInsufficient, setShowInsufficient] = useState(false);

  const [selectedUser, setSelectedUser] = useState({ client_id: -1 });
  let indice, ordine;
  if (props.browsing === false) {
    if (props.orders.length === 0) indice = 1;
    else {
      let f = props.orders.map((x) => x.id);
      indice = Math.max(...f) + 1;
    }
    if (props.orders.length === 0) ordine = 1;
    else {
      let f = props.orders.map((x) => x.order_id);
      ordine = Math.max(...f) + 1;
    }
  }

  let somma = 0;
  let wallet = props.clients
    .filter((x) => x.client_id === parseInt(props.clientid))
    .map((x) => x.budget);
  let amount = wallet[0];
  console.log(amount);

  if (props.orders) {
    let itemsAmount = props.orders
      .filter((x) => x.client_id === parseInt(props.clientid))
      .map((x) => x.OrderPrice);
    for (const b of itemsAmount) {
      somma = somma + b;
    }
  }

  console.log(somma);
  function getRightWeek(timepassed) {
    // the week number should be changed after the 23 o'clock of sunday. It becomes a new week since the customer can not order anymore in this week
    //Sunday from 23.00 until 23.59 consider this week orders

    if (dayjs(timepassed.date).day() === 0) {
      if (dayjs('01/01/2021 ' + timepassed.hour).hour() === 23) {
        const addWeekTime = dayjs(timepassed.date).add(1, 'week');
        //this week orders
        return {
          year: dayjs(addWeekTime).year(),
          week_number: dayjs(addWeekTime).week(),
        };
      }
    }
    console.log(dayjs(timepassed.date).week());
    return {
      year: dayjs(timepassed.date).year(),
      week_number: dayjs(timepassed.date).week(),
    };
  }

  /*USEFFECT products*/
  useEffect(() => {
    const getAllProducts = async () => {
      if (props.browsing) {
        const tmp_dy = {
          date: dayjs(props.time.date).add(1, 'week'),
          hour: props.time.hour,
        };
        await API.getAllExpectedProducts(
          getRightWeek(tmp_dy).year,
          getRightWeek(tmp_dy).week_number
        )
          .then((res) => {
            setProducts(res);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        await API.getAllConfirmedProducts(
          getRightWeek(props.time).year,
          getRightWeek(props.time).week_number
        )
          .then((res) => {
            setProducts(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    getAllProducts();
  }, [props.time]);

  useEffect(() => {
    const getCategories = async () => {
      const c = [{ name: 'All', active: 1 }, ...(await API.getAllCategories())];
      setCategories(c);
    };
    getCategories();
  }, []);

  const filterProducts = (activeCategory) => {
    if (activeCategory === undefined || activeCategory === null) {
      activeCategory = categories.find((c) => c.active === 1).name;
    }

    setProducts((prods) => {
      const arr = prods.map((p) => {
        if (activeCategory === 'All' || p.category === activeCategory) {
          if (
            searchTerm === '' ||
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            p.active = 1;
            return p;
          }
        }
        p.active = 0;
        return p;
      });
      return arr;
    });
  };

  rows.forEach((row, idx) => {
    productRows[idx] = products
      .filter((p) => p.active === 1)
      .slice(idx * 3, idx * 3 + 3);
  });

  const onConfirm = async () => {
    let tot = 0,
      total;

    if (props.isEmployee && selectedUser.client_id === -1) {
      setShowdanger(true);
      return;
    }

    console.log(
      deliveryFlag +
      ' ' +
      time +
      ' ' +
      date +
      ' ' +
      pickupDay +
      ' ' +
      pickupTime
    );

    let p,
      s,
      stato,
      ins = false;
    if (!location.state) {
      for (const pr of productsBasket) {
        tot = pr.price + tot;
      }
      total = tot + somma;
      console.log(total);
      console.log(amount);
      if (total > amount) {
        stato = 'pending';
      } else {
        stato = 'booked';
      }
      console.log(stato);
      for (const a of productsBasket) {
        p = (a.price * a.qty).toFixed(2);

        let _time, _date, _pickup;
        if (deliveryFlag === 'delivery') {
          _date = date;
          _time = time;
          _pickup = 0;
        } else {
          _date = dayjs(props.time.date)
            .add(1, 'week')
            .weekday(pickupDay)
            .format('YYYY-MM-DD');
          _time = pickupTime;
          _pickup = 1;
        }

        let order = new clientOrders(
          `${ordine}`,
          parseInt(props.clientid),
          a.name,
          a.id,
          a.qty,
          `${stato}`,
          null,
          p,
          `${indice}`,
          address,
          city,
          nation,
          zipCode,
          _date,
          _time,
          _pickup
        );
        console.log(order);
        API.addOrder(order).then(() => {
          props.setRecharged(true);
          setTimeout(() => {console.log("Order added successfully") }, 3000);
        });
        indice = indice + 1;
      }
    } else if (location.state.status === 'add') {
      for (const pr of productsBasket) {
        tot = pr.price * pr.qty + tot;
      }
      total = tot + somma;
      console.log(total);
      console.log(total);
      if (total <= amount) {
        for (const a of productsBasket) {
          p = (a.price * a.qty).toFixed(2);

          let _time, _date, _pickup;
          if (deliveryFlag === 'delivery') {
            _date = date;
            _time = time;
            _pickup = 0;
          } else {
            _date = dayjs(props.time.date)
              .add(1, 'week')
              .weekday(pickupDay)
              .format('YYYY-MM-DD');
            _time = pickupTime;
            _pickup = 1;
          }

          let order = new clientOrders(
            location.state.item.order_id,
            parseInt(props.clientid),
            a.name,
            a.id,
            a.qty,
            'booked',
            null,
            p,
            `${indice}`,
            address,
            city,
            nation,
            zipCode,
            _date,
            _time,
            _pickup
          );
          console.log(order);
          API.addOrder(order).then(() => {
            props.setRecharged(true);
            setTimeout(() => { console.log("Order added successfullly")}, 3000);
          });
          indice = indice + 1;
        }
      } else {
        ins = true;
      }
    } else {
      if (productsBasket.length === 1) {
        for (const pri of productsBasket) {
          tot = pri.price * pri.qty + tot;
        }
        total = tot + somma - location.state.item.OrderPrice;
        console.log(total);
        console.log(total);
        let i = location.state.item.id;

        let _time, _date, _pickup;
        if (deliveryFlag === 'delivery') {
          _date = date;
          _time = time;
          _pickup = 0;
        } else {
          _date = dayjs(props.time.date)
            .add(1, 'week')
            .weekday(pickupDay)
            .format('YYYY-MM-DD');
          _time = pickupTime;
          _pickup = 1;
        }
        let a = productsBasket[0];
        s = (a.price * a.qty).toFixed(2);
        let order = new clientOrders(
          location.state.item.order_id,
          location.state.item.client_id,
          a.name,
          a.id,
          a.qty,
          'booked',
          null,
          s,
          i,
          address,
          city,
          nation,
          zipCode,
          _date,
          _time,
          _pickup
        );

        if (total <= amount) {
          API.updateItem(order).then(() => {
            props.setRecharged(true);
            setTimeout(() => { console.log("Order added with success")}, 3000);
          });
        } else {
          ins = true;
        }
      }
    }

    if (!location.state || (location.state.status === 'add' && !ins)) {
      setShowsuccess(true);

      props.updateProps();
    } else if (location.state.status === 'update' && productsBasket.length > 1)
     {
      setShowUpdateError(true);
     } 
    else if (
      location.state.status === 'update' &&
      productsBasket.length === 1 &&
      !ins
    ) {
      setShowsuccess(true);

      props.updateProps();
    } else if (ins) setShowInsufficient(true);
  };
  function handleClick() {
    history.push('/registration');
  }
  function handleLogin() {
    history.push('/login');
  }

  const onAdd = (product, buyQty) => {
    const exist = productsBasket.find((x) => x.id === product.id);
    if (exist) {
      if (product.quantity >= exist.qty + buyQty) {
        setProductsBasket(
          productsBasket.map((x) =>
            x.id === product.id ? { ...exist, qty: exist.qty + buyQty } : x
          )
        );
      }
    } else {
      if (product.quantity >= buyQty) {
        setProductsBasket([...productsBasket, { ...product, qty: buyQty }]);
      }
    }
  };

  const onRemove = (product, removeQty) => {
    const exist = productsBasket.find((x) => x.id === product.id);
    if (exist.qty === 0.5) {
      setProductsBasket(productsBasket.filter((x) => x.id !== product.id));
    } else {
      setProductsBasket(
        productsBasket.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty - 0.5 } : x
        )
      );
    }
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const listOfCardProducts = productRows.map((line, index) => {
    return (
      <Row key={index} className="d-flex justify-content-between">
        {line.map((productline) => {
          if (productline.active === 0) return;
          return (
            <Col key={productline.id}>
              <Card
                className="rounded-3 shadow-lg mb-5 mx-auto"
                style={{ width: '18rem', maxWidth: '18rem' }}
              >
                <Card.Img
                  variant="top"
                  src={
                    process.env.PUBLIC_URL +
                    'products/' +
                    productline.id +
                    '.jpg'
                  }
                />
                <Card.Body>
                  <div className="d-block">
                    <span className="fs-4 fw-bold">
                      {capitalizeFirstLetter(productline.name)}
                    </span>
                    <br />
                    <span className="fs-6 text-muted">
                      Producer: {productline.providerName}
                    </span>
                    <br />
                    <span className="fs-6 text-muted">Origin: Torino</span>
                  </div>
                  <hr className="my-1" />
                  <span className="d-block">
                    {productline.price} €/{productline.unit}{' '}
                  </span>
                  <small className="d-block text-muted mb-3">
                    {productline.quantity} {productline.unit} left in stock
                  </small>
                  {props.browsing ? (
                    <Row>
                      <Button
                        variant="primary"
                        className="mb-1 align-middle"
                        disabled
                      >
                        {cartIcon} Add to Basket
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setCurrentProductDetails(productline);
                          setShowProductDetailsModal(true);
                        }}
                      >
                        {detailsIcon} Product details
                      </Button>
                    </Row>
                  ) : (
                    <>
                      <Row>
                        <Button
                          variant="primary"
                          className="mb-1 align-middle"
                          onClick={() => {
                            onAdd(productline, 0.5);
                          }}
                        >
                          {cartIcon} Add to Basket
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setCurrentProductDetails(productline);
                            setShowProductDetailsModal(true);
                          }}
                        >
                          {detailsIcon} Product details
                        </Button>
                      </Row>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  });

  function YouAreNotLoggedScreen() {
    return (
      <>
        <Row>
          <Col className="text-center">
            <span className="d-block text-center mt-5 mb-3 display-2">
              Do not have an account yet?
            </span>
            <Button className="m1 align-middle" size="lg" onClick={handleClick}>
              Sign up
            </Button>
            <Button
              className="m-1 align-middle"
              size="lg"
              onClick={handleLogin}
            >
              Login
            </Button>
          </Col>
        </Row>
      </>
    );
  }

  return (
    <>
      <Container fluid className=" w-100-custom">
        <span className="d-block text-center mt-5 mb-2 display-2">
          Product Booking
        </span>
        {props.browsing ? (
          <h5 className="d-block mx-auto mb-5 text-center text-muted">
            These are the products planned for the next week. They are not yet
            purchasable
          </h5>
        ) : (
          <>
            <h5 className="d-block mx-auto mb-5 text-center text-muted">
              Choose below the products you want to book for the client
            </h5>
          </>
        )}
        {props.isEmployee ? (
          <div className="d-block text-center">
            <Dropdown className="d-block mb-3" value={selectedUser.client_id}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select the desired client
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {props.clients.map((c) => (
                  <Dropdown.Item
                    onClick={() => setSelectedUser(c)}
                    key={c.client_id}
                    value={c.client_id}
                    eventKey={c.client_id}
                  >
                    <b>
                      {c.name} {c.surname}
                    </b>{' '}
                    ({c.email})
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            {selectedUser.client_id !== -1 ? (
              <h6 className="fw-bold">
                Ordering for:{' '}
                {selectedUser.name +
                  ' ' +
                  selectedUser.surname +
                  ' ' +
                  selectedUser.email}
              </h6>
            ) : (
              ''
            )}
          </div>
        ) : (
          ''
        )}
        {props.logged ? (
          <Row className="m-1">
            <Col
              lg={9}
              className="my-5 vertical-separator-products text-center"
            >
              <div className="d-block mx-5 my-3">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-9 text-center">
                      {isTabletOrMobile && <h4>Search for products</h4>}
                      <input
                        className="form-control mb-2"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search for products here"
                      />
                    </div>
                    <div className="col-lg-3 text-center mb-3">
                      <button
                        className="btn btn-primary px-5"
                        onClick={() => filterProducts()}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>

                <ul className="list-group list-group-horizontal-md">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      className={
                        cat.active
                          ? 'list-group-item list-group-item-action active'
                          : 'list-group-item list-group-item-action'
                      }
                      onClick={() => {
                        setCategories((cats) =>
                          cats.map((c) => {
                            if (c.name === cat.name) {
                              return { name: c.name, active: 1 };
                            }
                            return { name: c.name, active: 0 };
                          })
                        );
                        filterProducts(cat.name);
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </ul>
              </div>
              <hr style={{ color: 'black' }} />
              {isTabletOrMobile && !props.browsing && (
                <>
                  <Col className="my-5 px-5">
                    <Basket
                      completeAddressing={false}
                      clientid={props.clientid}
                      clients={props.clients}
                      setShowCompletePurchase={setShowCompletePurchase}
                      deliveryFlag={deliveryFlag}
                      address={address}
                      nation={nation}
                      city={city}
                      zipCode={zipCode}
                      time={time}
                      date={date}
                      pickupDay={pickupDay}
                      pickupTime={pickupTime}
                      setShowsuccess={setShowsuccess}
                      setShowUpdateError={setShowUpdateError}
                      setShowdanger={setShowdanger}
                      showInsufficient={showInsufficient}
                      setShowInsufficient={setShowInsufficient}
                      showsuccess={showsuccess}
                      showdanger={showdanger}
                      showUpdateError={showUpdateError}
                      productsBasket={productsBasket}
                      onAdd={onAdd}
                      onRemove={onRemove}
                      onConfirm={onConfirm}
                      capitalizeFirstLetter={capitalizeFirstLetter}
                      itemsPrice={itemsPrice}
                    />
                  </Col>
                  <hr style={{ color: 'black' }} />
                </>
              )}

              {products.filter((p) => p && p.active === 1).length > 0 ? (
                listOfCardProducts
              ) : (
                <div className="d-block text-center">
                  Oops! There are no products in this category.
                </div>
              )}
            </Col>
            {isBigScreen && !props.browsing && (
              <Col lg={3} className="my-5 px-5">
                <Basket
                  completeAddressing={false}
                  clientid={props.clientid}
                  clients={props.clients}
                  setShowCompletePurchase={setShowCompletePurchase}
                  deliveryFlag={deliveryFlag}
                  address={address}
                  nation={nation}
                  city={city}
                  zipCode={zipCode}
                  time={time}
                  date={date}
                  pickupDay={pickupDay}
                  pickupTime={pickupTime}
                  setShowsuccess={setShowsuccess}
                  setShowUpdateError={setShowUpdateError}
                  setShowdanger={setShowdanger}
                  showInsufficient={showInsufficient}
                  setShowInsufficient={setShowInsufficient}
                  showsuccess={showsuccess}
                  showdanger={showdanger}
                  showUpdateError={showUpdateError}
                  productsBasket={productsBasket}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  onConfirm={onConfirm}
                  capitalizeFirstLetter={capitalizeFirstLetter}
                  itemsPrice={itemsPrice}
                />
              </Col>
            )}
          </Row>
        ) : (
          <YouAreNotLoggedScreen />
        )}
      </Container>

      <Modal
        size="lg"
        show={showCompletePurchase}
        onHide={() => setShowCompletePurchase(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Complete the purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    value={address}
                    onChange={(ev) => {
                      setAddress(ev.target.value);
                    }}
                  />
                </Form.Group>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      value={city}
                      onChange={(ev) => {
                        setCity(ev.target.value);
                      }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      value={nation}
                      onChange={(ev) => {
                        setNation(ev.target.value);
                      }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control
                      value={zipCode}
                      onChange={(ev) => {
                        setZipCode(ev.target.value);
                      }}
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Col>
                    Date
                    <input
                      style={{
                        borderColor: '#ced4da',
                        borderWidth: '1px',
                        borderRadius: '3px',
                        textAlign: 'center',
                      }}
                      className="m-2"
                      type="date"
                      onChange={(ev) => setDate(ev.target.value)}
                    />
                  </Col>
                  <Col>
                    Time
                    <input
                      type="time"
                      style={{
                        borderColor: '#ced4da',
                        borderWidth: '1px',
                        borderRadius: '3px',
                        textAlign: 'center',
                      }}
                      className="m-2"
                      label="Time"
                      id="start"
                      onChange={(ev) => setTime(ev.target.value)}
                    />
                  </Col>
                </Row>
                <hr />
                <div className="d-block text-end">
                  <Button
                    onClick={() => {
                      setShowCompletePurchase(false);
                      setCompleteAddressing(true);
                    }}
                  >
                    Confirm
                  </Button>
                </div>
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
              <hr />
              <div className="d-block text-end">
                <Button
                  onClick={() => {
                    setShowCompletePurchase(false);
                    setCompleteAddressing(true);
                  }}
                >
                  Confirm
                </Button>
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>

      <Modal
        size="lg"
        show={showProductDetailsModal}
        onHide={() => setShowProductDetailsModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {capitalizeFirstLetter(
              currentProductDetails ? currentProductDetails.name : ''
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductPage
            browsing={props.browsing}
            onAdd={onAdd}
            setShowProductDetailsModal={setShowProductDetailsModal}
            prod={currentProductDetails}
            operationType="booking"
          ></ProductPage>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowProductDetailsModal(false)}
          >
            Back to the products
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const cartIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    className="bi bi-cart-plus"
    viewBox="0 0 16 16"
  >
    <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z" />
    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
  </svg>
);

const detailsIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    className="bi bi-info-circle"
    viewBox="0 0 16 16"
  >
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
  </svg>
);

export default Booking;
