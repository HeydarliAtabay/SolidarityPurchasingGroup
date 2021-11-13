import { Button, Row, Col, Card, Container } from 'react-bootstrap';
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
        <Row key={item.id}>
          <Col>
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
            <Button className="mt-3">Confirm</Button>
          </Row>
        </>
      )}
    </>
  );
}
export default Basket;
