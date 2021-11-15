import { Button, Row, Col, Card, Container, Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from './../API'
import Basket from './Basket';
import ProductPage from './ProductPage';

function Booking(props) {
  //the props that I want are: a vector containg the products and a state about login or not.
  const [isLogged, setLogged] = useState(true);
  const [productsBasket, setProductsBasket] = useState([]);

  const [showProductDetailsModal, setShowProductDetailsModal] = useState(false);
  const [currentProductDetails, setCurrentProductDetails] = useState();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const rows = [...Array(Math.ceil(products.filter((p) => (p && p.active === 1)).length / 3))];
  const productRows = Array(rows.filter(r => (r && r.active === 1)).length);

  const itemsPrice = productsBasket.reduce((a, c) => a + c.price * c.qty, 0); //a=accumulator c=current, so it computes the total

  const [showsuccess, setShowsuccess] = useState(false);
  const [showdanger, setShowdanger] = useState(false);

  /*USEFFECT products*/
  useEffect(() => {
    const getAllProducts = async () => {
      await API.getAllProducts()
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
      const c = [{ name: 'All', active: 1 }, ...await API.getAllCategories()];
      setCategories(c);
    }
    getCategories();
  }, []);

  const filterProducts = (activeCategory) => {
    if (activeCategory === undefined || activeCategory === null) {
      activeCategory = categories.find((c) => (c.active === 1)).name;
    }

    setProducts(prods => (
      prods.map(p => {
        if (searchTerm === "" ||
          (activeCategory === "All" && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.category === activeCategory && p.name.toLowerCase().includes(searchTerm.toLowerCase()))) {
          p.active = 1;
          return p;
        }
        p.active = 0;
        return p;
      })
    ))
  }

  rows.forEach((row, idx) => {
    productRows[idx] = products.slice(idx * 3, idx * 3 + 3);
  });

  const onConfirm = async () => {
    const order = {
      client_id: 1,
      order_items: productsBasket,
      total: itemsPrice.toFixed(2),
    };
    const res = await API.insertNewBookOrder(order);
    if (res.status == 200) setShowsuccess(true);
    else {
      setShowdanger(true);
    }
    props.updateProps();
  };

  const onAdd = (product) => {
    const exist = productsBasket.find((x) => x.id === product.id);
    if (exist) {
      if (product.quantity >= exist.qty + 1) {
        setProductsBasket(
          productsBasket.map((x) =>
            x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x
          )
        );
      }
    } else {
      if (product.quantity >= 1) {
        setProductsBasket([...productsBasket, { ...product, qty: 1 }]);
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
              <Card className="rounded-3 shadow-lg mb-5 mx-auto" style={{ width: '18rem', maxWidth: '18rem' }}>
                <Card.Img variant="top" src={process.env.PUBLIC_URL + 'products/' + productline.id + ".jpg"} />
                <Card.Body>
                  <div className="d-block">
                    <span className="fs-4 fw-bold">{capitalizeFirstLetter(productline.name)}</span>
                    <br />
                    <span className="fs-6 text-muted">Producer: {productline.providerName}</span>
                    <br />
                    <span className="fs-6 text-muted">Origin: Torino</span>
                  </div>
                  <hr className="my-1" />
                  <span className="d-block">{productline.price} €/{productline.unit} </span>
                  <small className="d-block text-muted mb-3">
                    {productline.quantity} {productline.unit} left in stock
                  </small>

                  <Row>
                    <Button
                      variant="primary"
                      className="mb-1 align-middle"
                      onClick={() => {
                        onAdd(productline);
                      }}
                    >
                      {cartIcon} Add to Booking List
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
          <Col>
            <h1>Do not have an account yet?</h1>
            <Button>Sign up</Button>
          </Col>
        </Row>
      </>
    );
  }

  return (
    <>
      <Container className="mx-3 w-100-custom">
        <span className="d-block text-center mt-5 mb-2 display-2">
          Product Booking
        </span>
        <h5 className="d-block mx-auto mb-5 text-center text-muted">
          Choose below the products you want to add to your Booking List
        </h5>
        {isLogged ? (
          <Row className>
            <Col lg={9} className="my-5 vertical-separator-products text-center">
              <div className="d-block mx-5 my-3">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-9 text-center">
                      <input className="form-control mb-2" value={searchTerm} onChange={(event) => (setSearchTerm(event.target.value))} placeholder="Search for products here" />
                    </div>
                    <div className="col-lg-3 text-center">
                      <button className="btn btn-primary px-5" onClick={() => (filterProducts())} >Search</button>
                    </div>
                  </div>
                </div>

                <ul className="list-group list-group-horizontal">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      className={cat.active ? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"}
                      onClick={() => {
                        setCategories((cats) =>
                          cats.map((c) => {
                            if (c.name === cat.name) {
                              return { name: c.name, active: 1 };
                            }
                            return { name: c.name, active: 0 };
                          }));
                        filterProducts(cat.name)
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </ul>
              </div>
              <hr className="hr-color-custom" />
              {products.filter((p) => (p && p.active === 1)).length > 0 ?
                listOfCardProducts
                :
                <div className="d-block text-center">
                  Oops! There are no products in this category.
                </div>
              }
            </Col>
            <Col lg={3} className="my-5 text-center px-5">
              <Basket
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
          </Row>
        ) : (
          <YouAreNotLoggedScreen />
        )}
      </Container>

      <Modal size="lg" show={showProductDetailsModal} onHide={() => (setShowProductDetailsModal(false))}>
        <Modal.Header closeButton>
          <Modal.Title>{capitalizeFirstLetter(currentProductDetails ? currentProductDetails.name : '')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductPage prod={currentProductDetails} operationType="booking"></ProductPage>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => (setShowProductDetailsModal(false))}>Back to the products</button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const cartIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cart-plus" viewBox="0 0 16 16">
  <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z" />
  <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
</svg>

const detailsIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
</svg>

const viewBookingIcon = <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-card-checklist" viewBox="0 0 16 16">
  <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
  <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z" />
</svg>

export default Booking;
