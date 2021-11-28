import {
  Button,
  Row,
  Col,
  Card,
  Container,
  Modal,
  Dropdown,
  Form,
} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from './../API';
import Basket from './Basket';
import ProductPage from './ProductPage';
import { useHistory } from 'react-router-dom';
import { clientOrders } from '../classes/ClientOrder';
import { useLocation } from 'react-router-dom';
function Booking(props) {
  const history = useHistory();

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

  let rows = [
    ...Array(Math.ceil(products.filter((p) => p && p.active === 1).length / 3)),
  ];
  let productRows = Array(rows.length);

  const itemsPrice = productsBasket.reduce((a, c) => a + c.price * c.qty, 0); //a=accumulator c=current, so it computes the total

  const [showsuccess, setShowsuccess] = useState(false);
  const [showdanger, setShowdanger] = useState(false);

  const [selectedUser, setSelectedUser] = useState({ client_id: -1 });
  const location = useLocation();
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

  /*USEFFECT products*/
  useEffect(() => {
    const getAllProducts = async () => {
      await API.getAllConfirmedProducts(2021, 1)
        .then((res) => {
          setProducts(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAllProducts();
  }, []);

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
    if (props.isEmployee && selectedUser.client_id === -1) {
      setShowdanger(true);
      return;
    }
    let p, s;
    if (!location.state) {
      for (const a of productsBasket) {
        p = (a.price * a.qty).toFixed(2);
        console.log(a);
        let order = new clientOrders(
          `${ordine}`,
          parseInt(props.clientid),
          a.name,
          a.id,
          'booked',
          p,
          `${indice}`,
          address,
          city,
          nation,
          zipCode,
          date,
          time
        );
        console.log(order);
        API.addOrder(order).then(() => {
          props.setRecharged(true);
          setTimeout(() => { }, 3000);
        });
        indice = indice + 1;
      }
    }
    else {
      let i = location.state.item.id;
      API.deleteOrderItem(location.state.item.id).then(setTimeout(() => { }, 3000));
      let a = productsBasket[0];
      s = (a.price * a.qty).toFixed(2);
      let order = new clientOrders(
        location.state.item.order_id,
        location.state.item.client_id,
        a.name,
        a.id,
        "booked",
        s,
        i);
      API.addOrder(order).then(() => {
        props.setRecharged(true);
        setTimeout(() => { }, 3000)
      });
    }




    setShowsuccess(true);

    props.updateProps();
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

  const onRemove = (product) => {
    const exist = productsBasket.find((x) => x.id === product.id);
    if (exist.qty == 1) {
      setProductsBasket(productsBasket.filter((x) => x.id != product.id));
    } else {
      setProductsBasket(
        productsBasket.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x
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
                            onAdd(productline, 1);
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
      <Container fluid className="mx-3 w-100-custom">
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
          <Row className>
            <Col
              lg={9}
              className="my-5 vertical-separator-products text-center"
            >
              <div className="d-block mx-5 my-3">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-9 text-center">
                      <input
                        className="form-control mb-2"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search for products here"
                      />
                    </div>
                    <div className="col-lg-3 text-center">
                      <button
                        className="btn btn-primary px-5"
                        onClick={() => filterProducts()}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>

                <ul className="list-group list-group-horizontal">
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
              <hr className="hr-color-custom" />
              {products.filter((p) => p && p.active === 1).length > 0 ? (
                listOfCardProducts
              ) : (
                <div className="d-block text-center">
                  Oops! There are no products in this category.
                </div>
              )}
            </Col>
            {!props.browsing ? (
              <Col lg={3} className="my-5 px-5">
                <Basket
                  completeAddressing={false}
                  clientid={props.clientid}
                  setShowCompletePurchase={setShowCompletePurchase}
                  address={address}
                  nation={nation}
                  city={city}
                  zipCode={zipCode}
                  time={time}
                  date={date}
                  setShowsuccess={setShowsuccess}
                  setShowdanger={setShowdanger}
                  showsuccess={showsuccess}
                  showdanger={showdanger}
                  productsBasket={productsBasket}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  onConfirm={onConfirm}
                  capitalizeFirstLetter={capitalizeFirstLetter}
                  itemsPrice={itemsPrice}
                />
              </Col>
            ) : (
              <></>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setShowCompletePurchase(false);
              setCompleteAddressing(true);
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
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

const viewBookingIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    fill="currentColor"
    className="bi bi-card-checklist"
    viewBox="0 0 16 16"
  >
    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
    <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z" />
  </svg>
);

export default Booking;
