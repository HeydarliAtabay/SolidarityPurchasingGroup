import { Button, Row, Col, Card, Container } from 'react-bootstrap';
function Basket(props) {
  return (
    <>
      <h2>Basket:</h2>
      {props.productsBasket.length === 0 && <div>Cart is Empty</div>}
      {props.productsBasket.map((item) => (
        <Row key={item.id}>
          <Col>
            <div>{item.name}</div>
          </Col>
          <Col>
            <Button onClick={() => props.onAdd(item)}>+</Button>
          </Col>
          <Col>
            {' '}
            <Button onClick={() => props.onRemove(item)}>-</Button>{' '}
          </Col>
          <Col>{item.qty}x Price</Col>
        </Row>
      ))}
      {props.productsBasket.length > 0 && (
        <Row>
          <Button className="mt-3">Confirm</Button>
        </Row>
      )}
    </>
  );
}
export default Basket;
