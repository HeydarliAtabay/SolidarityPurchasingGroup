import {
  Button,
  Row,
  Col,
  Card,
  Container,
  Modal,
  Form,
  Alert,
} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from './../API';
import ProductPage from './ProductPage';
import { useHistory, Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useMediaQuery } from 'react-responsive';

var weekday = require('dayjs/plugin/weekday');
dayjs.extend(weekday);

dayjs.Ls.en.weekStart = 1;

function Booking(props) {
  const history = useHistory();

  const [showProductDetailsModal, setShowProductDetailsModal] = useState(false);
  const [currentProductDetails, setCurrentProductDetails] = useState();

  const [products, setProducts] = useState([]);
  const [productRows, setProductRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeFarmer, setActiveFarmer] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)',
  });
  const isBigScreen = useMediaQuery({ query: '(min-width: 1225px)' });
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' });

  const [selectedUserID, setSelectedUserID] = useState(-1);
  const [selectedUser, setSelectedUser] = useState(null);

  const [showChangeItemModal, setShowChangeItemModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemID, setNewItemID] = useState(-1);

  function getPurchasingWeek(time) {
    return {
      year: dayjs(time.date).year(),
      week_number: dayjs(time.date).week(),
    };
  }

  function getBrowsingWeek(time) {
    //Saturday
    if (dayjs(time.date).day() === 6) {
      if (dayjs('01/01/2021 ' + time.hour).hour() < 9) {
        //Before SAT 9AM -> not available
        return {
          year: dayjs(time.date).year(),
          week_number: dayjs(time.date).week(),
        };
      }
      //After SAT 9AM -> available
      else {
        //next week = week + 2
        return {
          year: dayjs(time.date).add(1, 'week').year(),
          week_number: dayjs(time.date).add(1, 'week').week(),
        };
      }
    }
    //Sunday
    else if (dayjs(time.date).day() === 0) {
      if (dayjs('01/01/2021 ' + time.hour).hour() < 23) {
        //Before SUN 11PM -> available
        return {
          year: dayjs(time.date).year(),
          week_number: dayjs(time.date).week(),
        };
      }
      //After SUN 11PM -> available
      else {
        return {
          year: dayjs(time.date).add(1, 'week').year(),
          week_number: dayjs(time.date).add(1, 'week').week(),
        };
      }
    }
    //from Monday up to Saturday 9am -> showing for this week
    else {
      return {
        year: dayjs(time.date).year(),
        week_number: dayjs(time.date).week(),
      };
    }
  }

  /*USEFFECT products*/
  useEffect(() => {
    const getAllProducts = async () => {
      /* exploring products */
      if (props.browsing) {
        let res = await API.getAllExpectedProducts(
          getBrowsingWeek(props.time).year,
          getBrowsingWeek(props.time).week_number
        );
        setProducts(res);
        let rows = [
          ...Array(
            Math.ceil(res.filter((p) => p && p.active === 1).length / 3)
          ),
        ];
        let productsRows = Array(rows.length);
        rows.forEach((row, idx) => {
          productsRows[idx] = res
            .filter((p) => p.active === 1)
            .slice(idx * 3, idx * 3 + 3);
        });
        setProductRows(productsRows);
      } else if (props.purchasing) {
        /* buying products as client or staff */
        let res = await API.getAllConfirmedProducts(
          getPurchasingWeek(props.time).year,
          getPurchasingWeek(props.time).week_number
        );
        setProducts(res);
        let rows = [
          ...Array(
            Math.ceil(res.filter((p) => p && p.active === 1).length / 3)
          ),
        ];
        let productsRows = Array(rows.length);
        rows.forEach((row, idx) => {
          productsRows[idx] = res
            .filter((p) => p.active === 1)
            .slice(idx * 3, idx * 3 + 3);
        });
        setProductRows(productsRows);
      } else if (props.orderChangeItem && props.orderChangeItemID !== -1) {
        /* swapping item from order */
        const order = props.orders.find(
          (o) => o.id === props.orderChangeItemID
        );
        const prod_week = props.prods.find(
          (p) => p.id === order.product_id
        ).week;
        const prod_year = props.prods.find(
          (p) => p.id === order.product_id
        ).year;
        let res = await API.getAllConfirmedProducts(prod_year, prod_week);
        setProducts(res);
        /* filter products already in the client order - used when client modifies order */
        const orderID = props.orders.find(
          (o) => o.id === props.orderChangeItemID
        ).order_id;
        const orderProducts = props.orders
          .filter((o) => o.order_id === orderID)
          .map((o) => o.product_id);
        res = res.filter((prod) => !orderProducts.includes(prod.id));
        let rows = [
          ...Array(
            Math.ceil(res.filter((p) => p && p.active === 1).length / 3)
          ),
        ];
        let productsRows = Array(rows.length);
        rows.forEach((row, idx) => {
          productsRows[idx] = res
            .filter((p) => p.active === 1)
            .slice(idx * 3, idx * 3 + 3);
        });
        setProductRows(productsRows);
      } else if (props.orderAddItem && props.orderAddItemID !== -1) {
        /* adding new item to order */
        const order = props.orders.find(
          (o) => o.order_id === props.orderAddItemID
        );
        const prod_week = props.prods.find(
          (p) => p.id === order.product_id
        ).week;
        const prod_year = props.prods.find(
          (p) => p.id === order.product_id
        ).year;
        let res = await API.getAllConfirmedProducts(prod_year, prod_week);
        setProducts(res);
        /* filter products already in the client order - used when client modifies order */
        const orderProducts = props.orders
          .filter((o) => o.order_id === props.orderAddItemID)
          .map((o) => o.product_id);
        res = res.filter((prod) => !orderProducts.includes(prod.id));
        let rows = [
          ...Array(
            Math.ceil(res.filter((p) => p && p.active === 1).length / 3)
          ),
        ];
        let productsRows = Array(rows.length);
        rows.forEach((row, idx) => {
          productsRows[idx] = res
            .filter((p) => p.active === 1)
            .slice(idx * 3, idx * 3 + 3);
        });
        setProductRows(productsRows);
      }
    };
    getAllProducts();
  }, [props.time, props.orderChangeItemID, props.orderAddItemID]);

  /* Categories UseEffect */
  useEffect(() => {
    const getCategories = async () => {
      const c = [
        { id: 0, name: 'All categories' },
        ...(await API.getAllCategories()),
      ];
      setCategories(c);
    };
    getCategories();
  }, []);

  /* Farmers useEffect */
  useEffect(() => {
    const getFarmers = async () => {
      const f = [
        { id: 0, name: 'All farmers' },
        ...(await API.getAllProviders()),
      ];
      setFarmers(f);
    };
    getFarmers();
  }, []);

  /* Product filters useEffect */
  useEffect(() => {
    let prods = products;

    prods.forEach((p) => {
      if (
        searchTerm === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        p.active = 1;
      } else {
        p.active = 0;
      }
    });

    prods.forEach((p) => {
      if (
        p.active === 1 &&
        (activeCategory === 0 || p.categoryId === activeCategory)
      ) {
        p.active = 1;
      } else {
        p.active = 0;
      }
    });

    prods.forEach((p) => {
      if (
        p.active === 1 &&
        (activeFarmer === 0 || p.providerId === activeFarmer)
      ) {
        p.active = 1;
      } else {
        p.active = 0;
      }
    });

    setProducts(prods);

    let rows = [
      ...Array(Math.ceil(prods.filter((p) => p && p.active === 1).length / 3)),
    ];
    let productsRows = Array(rows.length);
    rows.forEach((row, idx) => {
      productsRows[idx] = prods
        .filter((p) => p.active === 1)
        .slice(idx * 3, idx * 3 + 3);
    });
    setProductRows(productsRows);
  }, [activeCategory, activeFarmer, searchTerm]);

  /* User selection by staff */
  useEffect(() => {
    if (selectedUserID === -1) {
      setSelectedUser(null);
      return;
    }

    if (props.clients.find((c) => c.client_id === parseInt(selectedUserID))) {
      setSelectedUser(
        props.clients.find((c) => c.client_id === parseInt(selectedUserID))
      );
    } else {
      setSelectedUserID(-1);
      setSelectedUser(null);
    }
  }, [selectedUserID]);

  const addToCart = (product, qty) => {
    if (props.userRole === 'employee' && selectedUserID === -1) {
      return;
    }

    const clientID =
      props.userRole === 'employee' ? selectedUserID : props.clientid;

    if (product.quantity === 0) {
      return;
    }

    let prod = { ...product, buyQty: 0 };
    let cart = props.cartItems;
    if (!cart.has(clientID)) {
      cart.set(clientID, { items: [] });
    }
    let clientCart = cart.get(clientID).items;
    let cartItemIndex = clientCart.findIndex((item) => item.id === product.id);
    if (cartItemIndex !== -1) {
      if (clientCart[cartItemIndex].buyQty + qty > product.quantity) {
        cart.get(clientID).items[cartItemIndex].buyQty = product.quantity;
      } else {
        cart.get(clientID).items[cartItemIndex].buyQty += qty;
      }
    } else {
      if (qty > product.quantity) {
        qty = product.quantity;
      }
      prod.buyQty = qty;
      cart.get(clientID).items.push(prod);
    }
    props.setCartItems(cart);
    props.setCartUpdated(true);
    props.setAuthAlert(null);
    props.setCartAlert({
      variant: 'success',
      msg:
        qty + ' ' + prod.unit + ' of ' + prod.name + ' was added to your cart.',
    });
    setTimeout(() => {
      props.setCartAlert(null);
    }, 10000);
  };

  function handleClick() {
    history.push('/registration');
  }

  function handleLogin() {
    history.push('/login');
  }

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
                style={{
                  width: '18rem',
                  maxWidth: '18rem',
                }}
              >
                <Card.Img
                  variant="top"
                  style={{
                    filter:
                      productline.quantity === 0 ? 'grayscale(100%)' : 'none',
                  }}
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
                      By <b>{productline.providerName}</b>
                    </span>
                    <br />
                    <span className="fs-6 text-muted">
                      {farmers.length > 0 &&
                        farmers.find((f) => f.id === productline.providerId)
                          .location}
                    </span>
                  </div>
                  <hr className="my-1" />
                  <span className="d-block">
                    {productline.price} €/{productline.unit}{' '}
                  </span>
                  <small className="d-block text-muted mb-3">
                    {productline.quantity > 0 &&
                      props.browsing &&
                      productline.quantity +
                        ' ' +
                        productline.unit +
                        ' expected'}
                    {productline.quantity > 0 &&
                      !props.browsing &&
                      productline.quantity +
                        ' ' +
                        productline.unit +
                        ' left in stock'}
                    {productline.quantity <= 0 && (
                      <span className="fw-bold text-danger">Out of stock</span>
                    )}
                  </small>
                  {props.browsing && (
                    <Row>
                      <Button
                        style={{ borderRadius: '25px' }}
                        variant="secondary"
                        onClick={() => {
                          setCurrentProductDetails(productline);
                          setShowProductDetailsModal(true);
                        }}
                      >
                        {detailsIcon} Product details
                      </Button>
                    </Row>
                  )}
                  {props.purchasing && props.userRole !== 'employee' && (
                    <Row>
                      <Button
                        style={{ borderRadius: '25px' }}
                        variant="primary"
                        className="mb-1 align-middle"
                        disabled={productline.quantity <= 0}
                        onClick={() => {
                          addToCart(productline, 0.5);
                        }}
                      >
                        {cartIcon} Add to Cart
                      </Button>
                      <Button
                        style={{ borderRadius: '25px' }}
                        variant="secondary"
                        onClick={() => {
                          setCurrentProductDetails(productline);
                          setShowProductDetailsModal(true);
                        }}
                      >
                        {detailsIcon} Product details
                      </Button>
                    </Row>
                  )}
                  {props.purchasing && props.userRole === 'employee' && (
                    <Row>
                      <Button
                        style={{ borderRadius: '25px' }}
                        variant="primary"
                        className="mb-1 align-middle"
                        disabled={
                          selectedUserID === -1 || productline.quantity <= 0
                        }
                        onClick={() => {
                          addToCart(productline, 0.5);
                        }}
                      >
                        {cartIcon} Add to client Cart
                      </Button>
                      <Button
                        style={{ borderRadius: '25px' }}
                        variant="secondary"
                        onClick={() => {
                          setCurrentProductDetails(productline);
                          setShowProductDetailsModal(true);
                        }}
                      >
                        {detailsIcon} Product details
                      </Button>
                    </Row>
                  )}
                  {props.orderChangeItem && (
                    <Row>
                      <Button
                        style={{ borderRadius: '25px' }}
                        variant="primary"
                        className="mb-1 align-middle"
                        disabled={productline.quantity <= 0}
                        onClick={() => {
                          setNewItemID(productline.id);
                          setShowChangeItemModal(true);
                        }}
                      >
                        {cartIcon} Swap with this product
                      </Button>
                      <Button
                        style={{ borderRadius: '25px' }}
                        variant="secondary"
                        onClick={() => {
                          setCurrentProductDetails(productline);
                          setShowProductDetailsModal(true);
                        }}
                      >
                        {detailsIcon} Product details
                      </Button>
                    </Row>
                  )}
                  {props.orderAddItem && (
                    <Row>
                      <Button
                        style={{ borderRadius: '25px' }}
                        variant="primary"
                        className="mb-1 align-middle"
                        disabled={productline.quantity <= 0}
                        onClick={() => {
                          setNewItemID(productline.id);
                          setShowAddItemModal(true);
                        }}
                      >
                        {cartIcon} Add this product
                      </Button>
                      <Button
                        style={{ borderRadius: '25px' }}
                        variant="secondary"
                        onClick={() => {
                          setCurrentProductDetails(productline);
                          setShowProductDetailsModal(true);
                        }}
                      >
                        {detailsIcon} Product details
                      </Button>
                    </Row>
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
  const bookingAvailable = () => {
    //Saturday
    if (dayjs(props.time.date).day() === 6) {
      if (dayjs('01/01/2021 ' + props.time.hour).hour() < 9) {
        //Before SAT 9AM -> not available
        return false;
      }
      //After SAT 9AM -> available
      else {
        //next week = week + 2
        return true;
      }
    }
    //Sunday
    else if (dayjs(props.time.date).day() === 0) {
      if (dayjs('01/01/2021 ' + props.time.hour).hour() < 23) {
        //Before SUN 11PM -> available
        return true;
      }
      //After SAT 9AM -> available
      else {
        //next week = week + 2
        return false;
      }
    }
    //from Monday up to Saturday 9am -> declaring for this week
    else {
      return false;
    }
  };

  return (
    <>
      <Container fluid className=" w-100-custom">
        <span className="d-block text-center mt-5 mb-2 display-2">
          Product Booking
        </span>
        {props.browsing && (
          <h5 className="d-block mx-auto mb-5 text-center text-muted">
            These are the expected products by the farmers. They are not yet
            purchasable
          </h5>
        )}
        {props.purchasing && props.userRole === 'employee' && (
          <h5 className="d-block mx-auto mb-5 text-center text-muted">
            Choose the client and then choose below the products you want to
            book for the selected client
          </h5>
        )}
        {props.purchasing && props.userRole === 'client' && (
          <h5 className="d-block mx-auto mb-5 text-center text-muted">
            Choose below the products you want to book and add them to the cart
          </h5>
        )}
        {props.orderChangeItem && (
          <h5 className="d-block mx-auto mb-5 text-center text-muted">
            Choose below the item to swap with the previously selected product
          </h5>
        )}
        {props.orderAddItem && (
          <h5 className="d-block mx-auto mb-5 text-center text-muted">
            Choose below the item to add to your order
          </h5>
        )}
        {props.userRole === 'employee' && (
          <div className="row">
            <div className="col-lg-4"></div>
            <div className="col-lg-4">
              <div className="d-block text-center">
                <h3 className="text-muted">Ordering for</h3>
              </div>
              <Form.Select
                size="lg"
                className="mb-3 mx-2"
                value={selectedUserID}
                onChange={(event) => setSelectedUserID(event.target.value)}
              >
                <option value={-1}>No client selected</option>
                {props.clients.map((c) => (
                  <option key={c.client_id} value={c.client_id}>
                    • {c.name} {c.surname} ({c.email})
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="col-lg-4"></div>
          </div>
        )}

        {props.logged ? (
          <Row className="m-1">
            <Col
              lg={3}
              className="my-5 text-center vertical-separator-products"
            >
              <ul className="list-group list-group-vertical my-3 mx-5">
                <div className="list-group-item bg-light">
                  <h3>Filter by category</h3>
                  <h6 className="text-muted">
                    Click one of the categories below to apply the filter
                  </h6>
                </div>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={
                      cat.id === activeCategory
                        ? 'list-group-item list-group-item-action active'
                        : 'list-group-item list-group-item-action'
                    }
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </ul>

              <ul className="list-group list-group-vertical my-3 mx-5">
                <div className="list-group-item bg-light">
                  <h3>Filter by farmer</h3>
                  <h6 className="text-muted">
                    Click one of the farmers below to apply the filter
                  </h6>
                </div>
                {farmers.map((farmer) => (
                  <button
                    key={farmer.id}
                    className={
                      farmer.id === activeFarmer
                        ? 'list-group-item list-group-item-action active'
                        : 'list-group-item list-group-item-action'
                    }
                    onClick={() => setActiveFarmer(farmer.id)}
                  >
                    {farmer.name}
                  </button>
                ))}
              </ul>
            </Col>
            <Col lg={9} className="my-5 text-center">
              <div className="d-block mx-5 my-3">
                <div className="container">
                  <div className="row">
                    {isTabletOrMobile && <h4>Search for products</h4>}
                    <input
                      className="form-control form-control-lg mb-2"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Type desired product here"
                    />
                  </div>
                </div>
              </div>
              {products.filter((p) => p && p.active === 1).length > 0 ? (
                listOfCardProducts
              ) : (
                <div className="d-block text-center">
                  Oops! There are no products in this category.
                </div>
              )}
            </Col>
          </Row>
        ) : (
          <YouAreNotLoggedScreen />
        )}
      </Container>
      {!bookingAvailable() && (
        <Modal
          show={true}
          dismissible={false}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body>
            The purchasing window is available from:{' '}
            <b>Satuday 09 AM until Sunday 11 PM</b>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                if (props.userRole === 'employee') history.push('/employee');
                else history.push('/client');
              }}
            >
              Understood
            </Button>
          </Modal.Footer>
        </Modal>
      )}

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
            purchasing={props.purchasing}
            browsing={props.browsing}
            orderChangeItem={props.orderChangeItem}
            orderAddItem={props.orderAddItem}
            addToCart={addToCart}
            setShowProductDetailsModal={setShowProductDetailsModal}
            prod={currentProductDetails}
            setShowChangeItemModal={setShowChangeItemModal}
            setShowAddItemModal={setShowAddItemModal}
            providers={farmers}
            setNewItemID={setNewItemID}
          ></ProductPage>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-danger"
            onClick={() => setShowProductDetailsModal(false)}
          >
            Back to the products
          </button>
        </Modal.Footer>
      </Modal>

      {props.orderChangeItem && (
        <ItemChangeModal
          show={showChangeItemModal}
          setShow={setShowChangeItemModal}
          oldID={props.orderChangeItemID}
          newID={newItemID}
          products={products}
          orders={props.orders}
          clients={props.clients}
          clientid={props.clientid}
          setRecharged={props.setRecharged}
          setRecharged1={props.setRecharged1}
          setOrderModified={props.setOrderModified}
        />
      )}

      {props.orderAddItem && (
        <ItemAddModal
          show={showAddItemModal}
          setShow={setShowAddItemModal}
          oldID={props.orderAddItemID}
          newID={newItemID}
          products={products}
          orders={props.orders}
          clients={props.clients}
          clientid={props.clientid}
          setRecharged={props.setRecharged}
          setRecharged1={props.setRecharged1}
          setOrderModified={props.setOrderModified}
        />
      )}
    </>
  );
}

function ItemChangeModal(props) {
  const history = useHistory();

  const [oldItem, setOldItem] = useState(null);
  const [newItem, setNewItem] = useState(null);
  const [buyQuantity, setBuyQuantity] = useState(0.5);
  const [swapItems, setSwapItems] = useState(false);
  const [actionAlert, setActionAlert] = useState(null);

  useEffect(() => {
    if (props.newID !== -1) {
      setNewItem({
        ...props.products.find((p) => p.id === props.newID),
        buyQty: 0.5,
      });
    }
    if (props.oldID !== -1) {
      const oldOrderEntry = props.orders.find((o) => o.id === props.oldID);
      if (props.products.find((p) => p.id === oldOrderEntry.product_id)) {
        setOldItem({
          ...props.products.find((p) => p.id === oldOrderEntry.product_id),
          buyQty: oldOrderEntry.order_quantity,
        });
      } else {
        setOldItem(null);
      }
    }
  }, [props.newID, props.oldID]);

  useEffect(() => {
    if (!swapItems) {
      return;
    }

    const changeItem = async () => {
      try {
        const oldOrderEntry = props.orders.find((o) => o.id === props.oldID);
        const new_item = {
          order_id: oldOrderEntry.order_id,
          client_id: oldOrderEntry.client_id,
          product_name: newItem.name,
          product_id: newItem.id,
          order_quantity: buyQuantity,
          state: oldOrderEntry.state,
          farmer_state: oldOrderEntry.farmer_state,
          OrderPrice: buyQuantity * newItem.price,
          id: oldOrderEntry.id,
          address: oldOrderEntry.address,
          city: oldOrderEntry.city,
          zipcode: oldOrderEntry.zipcode,
          Nation: oldOrderEntry.Nation,
          date: oldOrderEntry.date,
          time: oldOrderEntry.time,
          pickup: oldOrderEntry.pickup,
        };
        await API.updateItem(new_item);
        await API.increaseBalance(
          oldItem.buyQty * oldItem.price,
          oldOrderEntry.client_id
        ); /* increase balance by old item price */
        await API.increaseBalance(
          buyQuantity * newItem.price * -1,
          oldOrderEntry.client_id
        ); /* decrease balance by new item price */
        props.setRecharged(true);
        props.setRecharged1(true);
        props.setOrderModified(true);
        history.push('/orders');
      } catch (error) {
        console.log(error);
        setActionAlert({
          variant: 'danger',
          msg: 'Oops! Could not swap items. Please try again',
        });
      }
    };

    changeItem();
  }, [swapItems]);

  const capitalizeEachFirstLetter = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
  };

  const incrementQuantity = (qty) => {
    let item = newItem;
    if (item.buyQty + qty > item.quantity) {
      return;
    }
    item.buyQty += qty;
    setNewItem(item);
    setBuyQuantity(item.buyQty);
  };

  const decrementQuantity = (qty) => {
    let item = newItem;
    if (item.buyQty - qty > 0) {
      item.buyQty -= qty;
      setNewItem(item);
      setBuyQuantity(item.buyQty);
    }
    return;
  };

  const checkSwapItems = () => {
    if (oldItem && newItem) {
      const availableBudget =
        props.clients.find((c) => c.client_id === props.clientid).budget +
        oldItem.buyQty * oldItem.price;
      if (
        buyQuantity > 0 &&
        buyQuantity <= newItem.quantity &&
        buyQuantity * newItem.price <= availableBudget
      ) {
        setSwapItems(true);
      }
    }
    return;
  };

  const buttonDisabled = () => {
    if (oldItem && newItem) {
      const availableBudget =
        props.clients.find((c) => c.client_id === props.clientid).budget +
        oldItem.buyQty * oldItem.price;
      if (
        buyQuantity > 0 &&
        buyQuantity <= newItem.quantity &&
        buyQuantity * newItem.price <= availableBudget
      ) {
        return false;
      }
    }
    return true;
  };

  return (
    <Modal size="lg" show={props.show} onHide={() => props.setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          Order modification
          <br />
          <h4 className="lead text-muted">Swapping items</h4>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {actionAlert && (
          <Alert
            variant={actionAlert.variant}
            className="my-3 mx-2"
            dismissible={true}
            onClose={() => setActionAlert(null)}
          >
            {actionAlert.msg}
          </Alert>
        )}
        {oldItem && (
          <div className="list-group-item shadow bg-light">
            <div className="d-block text-center">
              <h4 className="d-inline-block text-muted me-3">
                Available wallet balance
              </h4>
              <h1 className="d-inline-block">
                {(
                  props.clients.find((c) => c.client_id === props.clientid)
                    .budget +
                  oldItem.buyQty * oldItem.price
                ).toFixed(2)}
                €
              </h1>
            </div>
          </div>
        )}
        {oldItem && (
          <div className="list-group-item shadow">
            <div className="row">
              <div className="col-md-2 mb-2 my-auto align-middle">
                <img
                  className="w-100 shadow rounded-circle"
                  src={
                    process.env.PUBLIC_URL + 'products/' + oldItem.id + '.jpg'
                  }
                  alt="Product img"
                />
              </div>
              <div className="col-md-6 mb-2 text-start mt-2">
                <div className="d-block">
                  <h4>{capitalizeEachFirstLetter(oldItem.name)}</h4>
                </div>
                <div className="d-block">
                  {stockIcon} {oldItem.buyQty} {oldItem.unit} purchased
                </div>
                <div className="d-block">
                  {priceIcon} {oldItem.price}€ / {oldItem.unit}
                </div>
              </div>
              <div className="col-md-4 mb-2 my-auto align-middle">
                <div className="d-block w-100">
                  <div className="d-inline-block my-1 px-1 w-25">
                    <Button
                      style={{ borderRadius: '25px' }}
                      variant="secondary"
                      className="w-100"
                      disabled={true}
                    >
                      -
                    </Button>
                  </div>
                  <div className="d-inline-block my-1 px-1 w-50">
                    <Form.Control
                      type="text"
                      className="w-100 text-center"
                      value={oldItem.buyQty + ' ' + oldItem.unit}
                      onChange={() => {
                        return;
                      }}
                    />
                  </div>
                  <div className="d-inline-block my-1 px-1 w-25">
                    <Button
                      style={{ borderRadius: '25px' }}
                      variant="primary"
                      className="w-100"
                      disabled={true}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="d-block w-100 px-1">
                  <Form.Control
                    type="text"
                    className="w-100 text-center"
                    value={
                      'Old item price: ' +
                      (oldItem.buyQty * oldItem.price).toFixed(2) +
                      '€'
                    }
                    onChange={() => {
                      return;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="d-block mb-0 mt-3 text-center">
          <h3>Swap with</h3>
        </div>
        <div className="d-block text-center">{arrowDown}</div>
        {newItem && (
          <div className="list-group-item shadow">
            <div className="row">
              <div className="col-md-2 mb-2 my-auto align-middle">
                <img
                  className="w-100 shadow rounded-circle"
                  src={
                    process.env.PUBLIC_URL + 'products/' + newItem.id + '.jpg'
                  }
                  alt="Product img"
                />
              </div>
              <div className="col-md-6 mb-2 text-start mt-2">
                <div className="d-block">
                  <h4>{capitalizeEachFirstLetter(newItem.name)}</h4>
                </div>
                <div className="d-block">
                  {stockIcon} {newItem.quantity} {newItem.unit} available
                </div>
                <div className="d-block">
                  {priceIcon} {newItem.price}€ / {newItem.unit}
                </div>
              </div>
              <div className="col-md-4 mb-2 my-auto align-middle">
                <div className="d-block w-100">
                  <div className="d-inline-block my-1 px-1 w-25">
                    <Button
                      style={{ borderRadius: '25px' }}
                      variant="secondary"
                      className="w-100"
                      onClick={() => decrementQuantity(0.5)}
                    >
                      -
                    </Button>
                  </div>
                  <div className="d-inline-block my-1 px-1 w-50">
                    <Form.Control
                      type="text"
                      className="w-100 text-center"
                      value={buyQuantity + ' ' + newItem.unit}
                      onChange={() => {
                        return;
                      }}
                    />
                  </div>
                  <div className="d-inline-block my-1 px-1 w-25">
                    <Button
                      style={{ borderRadius: '25px' }}
                      variant="primary"
                      className="w-100"
                      onClick={() => incrementQuantity(0.5)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="d-block w-100 px-1">
                  <Form.Control
                    type="text"
                    className="w-100 text-center fw-bold"
                    value={
                      'New item price: ' +
                      (buyQuantity * newItem.price).toFixed(2) +
                      '€'
                    }
                    onChange={() => {
                      return;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {oldItem &&
          newItem &&
          buyQuantity * newItem.price >
            props.clients.find((c) => c.client_id === props.clientid).budget +
              oldItem.buyQty * oldItem.price && (
            <Alert variant="danger" className="mt-4">
              <div className="d-block text-center">
                <h3 className="lead">
                  {dangerIcon} New item price cannot be greater than the
                  available budget
                </h3>
              </div>
            </Alert>
          )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => props.setShow(false)}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => checkSwapItems()}
          disabled={swapItems || buttonDisabled()}
        >
          {swapItems ? 'Swapping items...' : 'Confirm swap'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function ItemAddModal(props) {
  const history = useHistory();
  const [newItem, setNewItem] = useState(null);
  const [buyQuantity, setBuyQuantity] = useState(0.5);
  const [addItems, setAddItems] = useState(false);
  const [actionAlert, setActionAlert] = useState(null);

  useEffect(() => {
    if (props.newID !== -1) {
      setNewItem({
        ...props.products.find((p) => p.id === props.newID),
        buyQty: 0.5,
      });
    } else {
      setNewItem(null);
    }
  }, [props.newID]);

  useEffect(() => {
    if (!addItems) {
      return;
    }

    const addItem = async () => {
      try {
        const oldOrderEntry = props.orders.find(
          (o) => o.order_id === props.oldID
        );
        if (oldOrderEntry === undefined) {
          throw 'Could not find old order';
        }
        const new_item = {
          order_id: props.oldID,
          client_id: oldOrderEntry.client_id,
          product_name: newItem.name,
          product_id: newItem.id,
          order_quantity: buyQuantity,
          state: 'booked',
          farmer_state: null,
          OrderPrice: buyQuantity * newItem.price,
          id: Math.max(...props.orders.map((o) => o.id)) + 1,
          address: oldOrderEntry.address,
          city: oldOrderEntry.city,
          zipcode: oldOrderEntry.zipcode,
          Nation: oldOrderEntry.Nation,
          date: oldOrderEntry.date,
          time: oldOrderEntry.time,
          pickup: oldOrderEntry.pickup,
        };
        await API.addOrder(new_item);
        await API.increaseBalance(
          buyQuantity * newItem.price * -1,
          oldOrderEntry.client_id
        );
        props.setRecharged(true);
        props.setRecharged1(true);
        props.setOrderModified(true);
        history.push('/orders');
      } catch (error) {
        console.log(error);
        setActionAlert({
          variant: 'danger',
          msg: 'Oops! Could not swap items. Please try again',
        });
      }
    };

    addItem();
  }, [addItems]);

  const capitalizeEachFirstLetter = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
  };

  const incrementQuantity = (qty) => {
    let item = newItem;
    if (item.buyQty + qty > item.quantity) {
      return;
    }
    item.buyQty += qty;
    setNewItem(item);
    setBuyQuantity(item.buyQty);
  };

  const decrementQuantity = (qty) => {
    let item = newItem;
    if (item.buyQty - qty > 0) {
      item.buyQty -= qty;
      setNewItem(item);
      setBuyQuantity(item.buyQty);
    }
    return;
  };

  const checkAddItems = () => {
    if (props.oldID !== -1 && newItem) {
      const availableBudget = props.clients.find(
        (c) => c.client_id === props.clientid
      ).budget;
      if (
        buyQuantity > 0 &&
        buyQuantity <= newItem.quantity &&
        buyQuantity * newItem.price <= availableBudget
      ) {
        setAddItems(true);
      }
    }
    return;
  };

  const buttonDisabled = () => {
    if (props.oldID !== -1 && newItem) {
      const availableBudget = props.clients.find(
        (c) => c.client_id === props.clientid
      ).budget;
      if (
        buyQuantity > 0 &&
        buyQuantity <= newItem.quantity &&
        buyQuantity * newItem.price <= availableBudget
      ) {
        return false;
      }
    }
    return true;
  };

  return (
    <Modal size="lg" show={props.show} onHide={() => props.setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          Order modification
          <br />
          <h4 className="lead text-muted">Adding a new item</h4>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {actionAlert && (
          <Alert
            variant={actionAlert.variant}
            className="my-3 mx-2"
            dismissible={true}
            onClose={() => setActionAlert(null)}
          >
            {actionAlert.msg}
          </Alert>
        )}
        {props.oldID !== -1 && (
          <div className="list-group-item shadow bg-light">
            <div className="d-block text-center">
              <h4 className="d-inline-block text-muted me-3">
                Available wallet balance
              </h4>
              <h1 className="d-inline-block">
                {
                  props.clients.find((c) => c.client_id === props.clientid)
                    .budget
                }
                €
              </h1>
            </div>
          </div>
        )}
        {newItem && (
          <div className="list-group-item shadow">
            <div className="row">
              <div className="col-md-2 mb-2 my-auto align-middle">
                <img
                  className="w-100 shadow rounded-circle"
                  src={
                    process.env.PUBLIC_URL + 'products/' + newItem.id + '.jpg'
                  }
                  alt="Product img"
                />
              </div>
              <div className="col-md-6 mb-2 text-start mt-2">
                <div className="d-block">
                  <h4>{capitalizeEachFirstLetter(newItem.name)}</h4>
                </div>
                <div className="d-block">
                  {stockIcon} {newItem.quantity} {newItem.unit} available
                </div>
                <div className="d-block">
                  {priceIcon} {newItem.price}€ / {newItem.unit}
                </div>
              </div>
              <div className="col-md-4 mb-2 my-auto align-middle">
                <div className="d-block w-100">
                  <div className="d-inline-block my-1 px-1 w-25">
                    <Button
                      variant="secondary"
                      className="w-100"
                      onClick={() => decrementQuantity(0.5)}
                    >
                      -
                    </Button>
                  </div>
                  <div className="d-inline-block my-1 px-1 w-50">
                    <Form.Control
                      type="text"
                      className="w-100 text-center"
                      value={buyQuantity + ' ' + newItem.unit}
                      onChange={() => {
                        return;
                      }}
                    />
                  </div>
                  <div className="d-inline-block my-1 px-1 w-25">
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={() => incrementQuantity(0.5)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="d-block w-100 px-1">
                  <Form.Control
                    type="text"
                    className="w-100 text-center fw-bold"
                    value={
                      'New item price: ' +
                      (buyQuantity * newItem.price).toFixed(2) +
                      '€'
                    }
                    onChange={() => {
                      return;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {props.oldID !== -1 &&
          newItem &&
          buyQuantity * newItem.price >
            props.clients.find((c) => c.client_id === props.clientid)
              .budget && (
            <Alert variant="danger" className="mt-4">
              <div className="d-block text-center">
                <h3 className="lead">
                  {dangerIcon} New item price cannot be greater than the
                  available budget
                </h3>
              </div>
            </Alert>
          )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => props.setShow(false)}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => checkAddItems()}
          disabled={addItems || buttonDisabled()}
        >
          {addItems ? 'Adding new item...' : 'Add item to order'}
        </Button>
      </Modal.Footer>
    </Modal>
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

const arrowDown = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    fill="currentColor"
    className="bi bi-caret-down-fill"
    viewBox="0 0 16 16"
  >
    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
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

export default Booking;
