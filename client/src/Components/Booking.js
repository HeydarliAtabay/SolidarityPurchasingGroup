import { Button, Row, Col, Card, Container } from 'react-bootstrap';
import { useState } from 'react';

function Booking(props) {
  //the props that I want are: a vector containg the products and a state about login or not.
  const [isLogged, setLogged] = useState(true);
  const products = [
    { product_id: 1, product_name: 'Potato' },
    { product_id: 2, product_name: 'Tomato' },
    { product_id: 3, product_name: 'Finocchio' },
    { product_id: 4, product_name: 'Insalata' },
    { product_id: 5, product_name: 'Olio' },
    { product_id: 6, product_name: 'Carote' },
  ];

  const rows = [...Array(Math.ceil(products.length / 4))];
  const productRows = Array(rows.length);
  rows.forEach((row, idx) => {
    productRows[idx] = products.slice(idx * 4, idx * 4 + 4);
  });

  const listOfCardProducts = productRows.map((line, index) => {
    return (
      <>
        <Row key={index} className="justify-content-between mt-5">
          {line.map((productline) => {
            return (
              <Col align="center">
                <Card style={{ width: '18rem' }}>
                  <Card.Img variant="top" />
                  <Card.Body>
                    <Card.Title>Card Title</Card.Title>
                    <Card.Text style={{ textAlign: 'center' }}>
                      {productline.product_name}
                    </Card.Text>
                    <Col align="center">
                      <select
                        style={{ textAlign: 'center' }}
                        class="custom-select my-1 mr-sm-2"
                        id="inlineFormCustomSelectPref"
                      >
                        <option selected>Choose...</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">2</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </Col>
                    <Row>
                      <Button variant="outline-secondary">
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
                          <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
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
      {isLogged ? listOfCardProducts : <YouAreNotLoggedScreen />}
    </Container>
  );
}
export default Booking;
/* <Col>
                
              </Col>*/
