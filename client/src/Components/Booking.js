import { Button, Row, Col, Card, Container } from 'react-bootstrap';
import { useState } from 'react';
import Basket from './Basket';

function Booking(props) {
  //the props that I want are: a vector containg the products and a state about login or not.
  const [isLogged, setLogged] = useState(true);
  const [productsBasket, setProductsBasket] = useState([]);
  const [update, setUpdate] = useState(false);

  /* const products = [
    { id: 1, name: 'Potato' },
    { id: 2, name: 'Tomato' },
    { id: 3, name: 'Finocchio' },
    { id: 4, name: 'Insalata' },
    { id: 5, name: 'Olio' },
    { id: 6, name: 'Carote' },
  ];*/

  const rows = [...Array(Math.ceil(props.products.length / 3))];
  const productRows = Array(rows.length);
  rows.forEach((row, idx) => {
    productRows[idx] = props.products.slice(idx * 3, idx * 3 + 3);
  });

  const onAdd = (product) => {
    const exist = productsBasket.find((x) => x.id === product.id);
    if (exist) {
      setProductsBasket(
        productsBasket.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x
        )
      );
    } else {
      setProductsBasket([...productsBasket, { ...product, qty: 1 }]);
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
  const listOfCardProducts = productRows.map((line, index) => {
    return (
      <>
        <Row key={index} className="justify-content-between mt-5">
          {line.map((productline) => {
            return (
              <Col>
                <Card style={{ width: '18rem' }}>
                  <Card.Img variant="top" />
                  <Card.Body>
                    <Card.Title>{productline.name}</Card.Title>

                    <Row>
                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          onAdd(productline);
                        }}
                      >
                        Add to Cart
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-cart-plus"
                          viewBox="0 0 16 16"
                          className="m-1"
                        >
                          <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z" />
                          <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.301 1.607 1.398 7.985A.5.5 0 0 0 3 12h1a2 2 0 1 0 0 3 2 2 0 0 0 0-3h7a2 2 0 1 0 0 3 2 2 0 0 0 0-3h1a.5.5 0 0 0 .391-.308l1.5-8A.5.5 0 0 0 13.5 3H2.89l-.305-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 3h10.796l-1.313 7h-8.17zM6 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                        </svg>
                      </Button>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </>
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
    <Container>
      <h1 className="pt-3" style={{ textAlign: 'center' }}>
        Booking
      </h1>
      {isLogged ? (
        <Row>
          <Col xs={9}>
            {' '}
            <h2>Product:</h2>
            {listOfCardProducts}
          </Col>
          <Col xs={3}>
            <Basket
              productsBasket={productsBasket}
              onAdd={onAdd}
              onRemove={onRemove}
            />
          </Col>
        </Row>
      ) : (
        <YouAreNotLoggedScreen />
      )}
    </Container>
  );
}
export default Booking;
/*else if (productsBasket.length == 1) {
      return (
        <>
          <p>
            1°- Product: {productsBasket[0].name} Qty:{' '}
            {productsBasket[0].qty}
          </p>{' '}
        </>
      );
    }
    
     <select
                        style={{ textAlign: 'center' }}
                        class="custom-select my-1 mr-sm-2"
                        id="inlineFormCustomSelectPref"
                        onChange={() => {
                          setqty(2);
                        }}
                      >
                        <option selected>Choose...</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">2</option>
                        <option value="3">3</option>
                        <option value="5">5</option>
                      </select>
    
    */