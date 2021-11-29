import { Button, Row, Col, Card, Container, Alert } from 'react-bootstrap';
import { useState } from 'react';

import API from '../API'

function Basket(props) {
  const [mailerState, setMailerState] = useState({
    email: "",
    message: ""
  });
  const [emailSent,setEmailSent]=useState(false)

  const handleSubmitEmail = (event) => {

   API.submitEmail(mailerState).then(()=>{
    setEmailSent(true) 
    });
                 
            
  }

  console.log(props.clients)
  console.log(props.clientid)
  return (
    <>

      <h2 className="text-center">Basket: </h2>
      {props.productsBasket.length === 0 && (
        <div className="text-center">Cart is Empty</div>
      )}
      {props.productsBasket.map((item) => (
        <Container className="text-center">
          <Row key={item.id} className="pt-3">
            <Col xs="4">
              <div>{props.capitalizeFirstLetter(item.name)}</div>
            </Col>
            <Col>
              <Button
                variant="success"
                width="16"
                onClick={() => props.onAdd(item, 1)}
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
              {item.qty}
              {item.unit} x €{item.price.toFixed(2)}
            </Col>
          </Row>
        </Container>
      ))}
      {props.productsBasket.length > 0 && (
        <>
          <Row>
            <Col align="center" className="mb-3">
              Total: €{props.itemsPrice.toFixed(2)}
            </Col>
          </Row>
          <Row className="justify-content-between align-items-center mb-4">
            <Col>
              <span>Delivery data</span>
            </Col>
            <Col>
              <Button
                variant="outline-primary"
                onClick={() => props.setShowCompletePurchase(true)}
              >
                Insert
              </Button>
            </Col>
          </Row>

          {props.address !== '' &&
          props.nation !== '' &&
          props.city != '' &&
          props.zipCode !== '' &&
          props.date !== '' &&
          props.time !== '' ? (
            <>
              <Container fluid>
                <Row>
                  <span>Address: {props.address}</span>
                  <span>Nation: {props.nation}</span>
                  <span>City: {props.city}</span>
                  <span>ZipCode: {props.zipCode}</span>
                  <span>Date: {props.date}</span>
                  <span>Time: {props.time}</span>
                </Row>
              </Container>
              <Row>
              {props.clients.filter(x=>x.client_id===parseInt(props.clientid)).map((s)=>
             
              <>
              
               <Button onClick={() =>{
                props.onConfirm()
                setMailerState((prevState) => ({
                  ...prevState,
                  email: s.email,
                  message: `Dear ${s.name} ${s.surname}, Your order from Solidarity Purchase group was confirmed, You will be informed when your products will be ready to deliver
                  `
          
                  
                }));
              handleSubmitEmail();
              setEmailSent(true)

                } } className="mt-3">
                Confirm
              </Button>{' '}

              {emailSent&& 
              <>
              <Button variant="secondary" onClick={() =>{
                setMailerState((prevState) => ({
                  ...prevState,
                  email: s.email,
                  message: `Dear ${s.name} ${s.surname}, Your order from Solidarity Purchase group was confirmed, You will be informed when your products will be ready to deliver
                  `
          
                  
                }));
              handleSubmitEmail();
              setEmailSent(true)

                } } className="mt-3">
                Resend Email
              </Button>{' '}
              </>
              }
              </>
              )}
               
              </Row>
            </>
          ) : (
            <></>
          )}
          <Row>
            <Alert className="m-3" show={props.showsuccess} variant="success">
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
              className="m-3"
              show={props.showdanger}
              onClose={() => props.setShowdanger(false)}
              variant="danger"
            >
              <Alert.Heading>Something goes wrong</Alert.Heading>
              <hr />
              <div className="d-flex justify-content-end">
                <Button
                  onClick={() => props.setShowdanger(false)}
                  variant="outline-danger"
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
