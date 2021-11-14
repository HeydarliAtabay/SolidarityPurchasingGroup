import { Button, Row, Col, Card, Container, Alert } from 'react-bootstrap';
import { useState } from 'react';

function Basket(props) {
  const itemsPrice = props.productsBasket.reduce(
    (a, c) => a + c.price * c.qty,
    0
  ); //a=accumulator c=current, so it computes the total
  return (
    <>
      <h2>Basket:</h2>
      {props.productsBasket.length === 0 && <div>Cart is Empty</div>}
      {props.productsBasket.map((item) => (
        <Row key={item.id} className="pt-3">
          <Col xs="4">
            <div>{props.capitalizeFirstLetter(item.name)}</div>
          </Col>
          <Col>
            <Button
              variant="success"
              width="16"
              onClick={() => props.onAdd(item)}
            >
              +
            </Button>
          </Col>
          <Col>
            {' '}
            <Button
              variant="danger"
              width="16"
              onClick={() => props.onRemove(item)}
            >
              -
            </Button>{' '}
          </Col>
          <Col>
            {item.qty}x€{item.price.toFixed(2)}
          </Col>
        </Row>
      ))}
      {props.productsBasket.length > 0 && (
        <>
          <Row>
            <Col align="center" className="mt-3">
              Total: €{itemsPrice.toFixed(2)}
            </Col>
          </Row>
          <Row>
            <Button onClick={() => props.onConfirm()} className="mt-3">
              Confirm
            </Button>
            <Alert show={props.showsuccess} variant="success">
              <Alert.Heading>Order success</Alert.Heading>
              <hr />
              <div className="d-flex justify-content-end">
                <Button
                  onClick={() => props.setShowsuccess(false)}
                  variant="outline-success"
                >
                  Close
                </Button>
              </div>
            </Alert>
            <Alert
              show={props.showdanger}
              onClose={() => props.setShowdanger(false)}
              variant="danger"
            >
              <Alert.Heading>Something goes wrong</Alert.Heading>
              <hr />
              <div className="d-flex justify-content-end">
                <Button
                  onClick={() => props.setShowdanger(false)}
                  variant="outline-success"
                >
                  Close
                </Button>
              </div>
            </Alert>
          </Row>
        </>
      )}
    </>
  );
}
export default Basket;
