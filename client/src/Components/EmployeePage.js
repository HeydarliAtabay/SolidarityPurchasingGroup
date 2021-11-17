import API from '../API';
import DeliverList from './DeliverList';
import { Container, Button, Row, Col, ListGroup, ListGroupItem, Image, Modal, Form } from 'react-bootstrap';

import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

function ModalWalletTopUp(props) {
  const { onClose, onSave, clients, methods } = props;
  const [clientId, setClientId] = useState(1)
  const [method, setMethod] = useState(methods ? methods[0].method_name : "None")
  const [methodId, setMethodId] = useState(1)
  const [number, setNumber] = useState("")
  const [valid, setValid] = useState("")
  const [cvv, setCvv] = useState("")
  const [amount, setAmount] = useState(0)


  useEffect(() => {

    methods.forEach(element => {
      if (method === element.method_name) {
        setMethodId(element.method_id)
      }
    });

  }, [method])

  {/*Should be modified*/ }
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();


    const newTransaction = Object.assign({}, {
      type: "wallet top-up",
      client_id: clientId,
      method_id: methodId,
      account_num: number,
      amount: amount,
      date: "14-11-2021",
      time: "00:00",
      status: 1
    });

    onSave(newTransaction, amount, clientId)
    window.location.reload(false);

    // submit a test order.
   /* let users = document.getElementById('formUser');
    let selected_client_id = users.options[users.selectedIndex].id;

    // TODO: once the frontend form is done, obtain the orders array from it and pass it to insertNewOrder.
    // orders currently has a temporary test order.
    const orders = [{ product_id: 1, quantity: 8 }, { product_id: 2, quantity: 10 }, { product_id: 10, quantity: 220 }];
    const new_order = API.insertNewOrder(selected_client_id, orders);

    console.log(new_order.status);

    if (new_order.status === "OK")
      alert("Order placed successfully!");
    else
      alert("Something went wrong while processing your order."); */
  };

  return (
    <div className="cont">
      <Modal show onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Wallet Top-up</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group as={Col} controlId="formUser">

              <Row>
                <Col sm={4}>
                  <Form.Label>Select Client</Form.Label>
                  <Form.Control
                    as="select"
                    value={clientId}
                    onChange={(ev) => {
                      setClientId(ev.target.value)
                    }}
                  >
                    {
                      clients.map((client) => {
                        return (
                          <option key={`${client.client_id}`} id={`${client.client_id}`}>
                            {client.client_id}
                          </option>
                        )
                      })
                    }
                  </Form.Control>
                </Col>
                <Col sm={6}>
                  <Form.Label>Name & Surname</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={`${clients[clientId - 1].name} ${clients[clientId - 1].surname} `}
                    disabled
                  />
                </Col>
                <Col sm={2}>
                  <Form.Label>Balance</Form.Label>
                  <Form.Control
                    type="text"
                    name="balance"
                    value={clients[clientId - 1].budget}
                    disabled
                  />
                </Col>

              </Row>


            </Form.Group>



            <Form.Group as={Col} controlId="formMethod">
              <Form.Label>Select Payment Method</Form.Label>
              <Form.Control
                as="select"
                value={method}
                onChange={(ev) => {
                  setMethod(ev.target.value)
                }}
              >
                {
                  methods.map((singlemethod) => {
                    return (
                      <option>
                        {singlemethod.method_name}
                      </option>
                    )
                  })
                }
              </Form.Control>
            </Form.Group>

            {/*For debit/credit card payment */}
            {(method === "Credit/debit card") &&
              <>
                <Form.Group>
                  <h5 className="regText" >Card details</h5>
                  <Row>
                    <Col sm={4}>
                      <Form.Label>Card Holder</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardholder"
                        placeholder="Card Holder name"
                        value={`${clients[clientId - 1].name} ${clients[clientId - 1].surname} `}
                        disabled
                      />
                    </Col>
                    <Col sm={8}>
                      <Form.Label>Card No</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardnumber"
                        placeholder="Card Number"
                        value={number}
                        onChange={(ev) => {
                          setNumber(ev.target.value)
                        }}

                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <Form.Label>Valid</Form.Label>
                      <Form.Control
                        type="text"
                        name="validity"
                        placeholder="MM/YY"
                        value={valid}
                        onChange={(ev) => {
                          setValid(ev.target.value)
                        }}
                      />
                    </Col>
                    <Col sm={4}>
                      <Form.Label>CVV</Form.Label>
                      <Form.Control
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        value={cvv}
                        onChange={(ev) => {
                          setCvv(ev.target.value)
                        }}
                      />
                    </Col>
                    <Col sm={4}>
                      <Form.Label>Amount(€)</Form.Label>
                      <Form.Control
                        type="text"
                        name="amount"
                        placeholder="0.0"
                        value={amount}
                        onChange={(ev) => {
                          setAmount(ev.target.value)
                        }}
                      />
                    </Col>

                  </Row>

                </Form.Group>

              </>

            }

            {/*For Satispay */}
            {(method === "Satispay") &&
              <>
                <Form.Group>
                  <h5 className="regText" >SatisPay account details</h5>
                  <Row>
                    <Col sm={8}>
                      <Form.Label>Account Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardnumber"
                        placeholder="Satispay Account Number"
                        value={number}
                        onChange={(ev) => {
                          setNumber(ev.target.value)
                        }}

                      />
                    </Col>
                    <Col sm={4}>
                      <Form.Label>Amount(€)</Form.Label>
                      <Form.Control
                        type="text"
                        name="amount"
                        placeholder="0.0"
                        value={amount}
                        onChange={(ev) => {
                          setAmount(ev.target.value)
                        }}
                      />
                    </Col>
                  </Row>
                </Form.Group>

              </>

            }

            {/*Bank Account */}
            {(method === "Bank Account") &&
              <>
                <Form.Group>
                  <h5 className="regText" >Account</h5>
                  <Row>
                    <Col sm={4}>
                      <Form.Label>Account Holder</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardholder"
                        placeholder="Account Holder name"
                        value={`${clients[clientId - 1].name} ${clients[clientId - 1].surname} `}
                        disabled
                      />
                    </Col>
                    <Col sm={8}>
                      <Form.Label>IBAN</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardnumber"
                        placeholder="IBAN address"
                        value={number}
                        onChange={(ev) => {
                          setNumber(ev.target.value)
                        }}

                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <Form.Label>Bank</Form.Label>
                      <Form.Control
                        type="text"
                        name="Bank"
                        placeholder="Bank name"
                        value={valid}
                        onChange={(ev) => {
                          setValid(ev.target.value)
                        }}
                      />
                    </Col>
                    <Col sm={4}>
                      <Form.Label>SWIFT</Form.Label>
                      <Form.Control
                        type="text"
                        name="SWIF"
                        placeholder="SWIFT code"
                        value={cvv}
                        onChange={(ev) => {
                          setCvv(ev.target.value)
                        }}
                      />
                    </Col>
                    <Col sm={4}>
                      <Form.Label>Amount(€)</Form.Label>
                      <Form.Control
                        type="text"
                        name="amount"
                        placeholder="0.0"
                        value={amount}
                        onChange={(ev) => {
                          setAmount(ev.target.value)
                        }}
                      />
                    </Col>

                  </Row>

                </Form.Group>

              </>

            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Top-up clients wallet
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}


function EmployeePage(props) {
  const { clients, methods, addTr, topUp } = props
  const history = useHistory()
  const MODAL = { CLOSED: -2, ADD: -1 };
  const [selectedTask, setSelectedTask] = useState(MODAL.CLOSED);

  const handleClose = () => {
    setSelectedTask(MODAL.CLOSED);

  }

  const handleSave = (tr, amount, client) => {
    addTransaction(tr)
    increaseBalance(amount, client)
    setSelectedTask(MODAL.CLOSED);
  }

  function addTransaction(tr) {
    addTr(tr)
  }

  function increaseBalance(amount, client) {
    topUp(amount, client)

  }

  const [show, setShow] = useState(false);
  let b = "booked";
  return (<>
    <br />
    <Container fluid>
      <span className="d-block text-center mt-5 mb-2 display-2">
        Shop Personnel Area
      </span>
      <Row>
        <Col xs={3} md={2}>
          <ListGroup variant="flush">
            <ListGroupItem>
              <Button variant="light" style={{ 'fontSize': 22, 'borderStyle': 'hidden', 'backgroundColor': "#ffb6c1" }} onClick={() => setShow(true)}>Show products to be delivered</Button>
            </ListGroupItem>
            <ListGroupItem>
              <Button variant="light" style={{ 'fontSize': 22, 'borderStyle': 'hidden', 'backgroundColor': "#ffb6c1" }}
                onClick={(event) => {
                  history.push("/registration")
                }}
              > Make a registration for the new client </Button>
            </ListGroupItem >
            {/*Button for opening a modal form for making a wallet top up */}
            <ListGroupItem>
              <Button variant="light" style={{ 'fontSize': 22, 'borderStyle': 'hidden', 'backgroundColor': "#ffb6c1" }}
                onClick={() => { setShow(false); setSelectedTask(MODAL.ADD) }}
              > Make a top-up of the client wallet </Button>
            </ListGroupItem >
            
            <ListGroupItem>
              <Button variant="light" style={{ 'fontSize': 22, 'borderStyle': 'hidden', 'backgroundColor': "#ffb6c1" }}
                onClick={(event) => {
                  history.push("/staff-booking")
                }}
              > Make a new order for client </Button>
            </ListGroupItem >
          </ListGroup></Col>
        {(selectedTask !== MODAL.CLOSED) && <ModalWalletTopUp onSave={handleSave} clients={clients} methods={methods} onClose={handleClose} ></ModalWalletTopUp>}

        <Col xs={5} md={5}>
          {show ?   //set recharged della tabella ordini-clienti
                  <DeliverList setRecharged={props.setRecharged} orders={props.orders} setShow={setShow} b={b} />: <></>}
        </Col></Row>
      <br />

    </Container>

  </>

  );
}






export default EmployeePage;
