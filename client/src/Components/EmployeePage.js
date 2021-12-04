import DeliverList from './DeliverList';
import { Container, Button, Row, Col, ListGroup, ListGroupItem, Modal, Form, Dropdown} from 'react-bootstrap';
import{ Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

function ModalWalletTopUp(props) {
  const { onClose, onSave, clients, methods } = props;
  const [clientId, setClientId] = useState(1)
  const [selectedUser, setSelectedUser] = useState({ client_id: -1 });
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
    let today=new Date()

    const newTransaction = Object.assign({}, {
      type: "wallet top-up",
      client_id: clientId,
      method_id: methodId,
      account_num: number,
      amount: amount,
      date: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
      time: today.getHours()+':'+today.getMinutes() +':'+ today.getSeconds(),
      status: 1
    });

    onSave(newTransaction, amount, clientId)
    window.location.reload(false);

    
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
                <Col sm={8}>
                <Form.Label>Select Client</Form.Label>
                <Dropdown className="d-block mb-3" value={selectedUser.client_id}>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Select the desired client
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {clients.map((c) => (
                  <Dropdown.Item onClick={() =>{
                    (setSelectedUser(c))
                    setClientId(c.client_id)

                  } } key={c.client_id} value={c.client_id} eventKey={c.client_id}><b>{c.name} {c.surname}</b> ({c.email})</Dropdown.Item>
                ))}

              </Dropdown.Menu>
            </Dropdown>
                </Col>
                <Col sm={4}>
                  <Form.Label>Balance</Form.Label>
                  <Form.Control
                    type="text"
                    name="balance"
                    value={(selectedUser.client_id !== -1) ? selectedUser.budget  : "0.0"}
                    disabled
                  />
                </Col>
                {selectedUser.client_id !== -1 ? <h6 className="fw-bold">Wallet top-up for: {selectedUser.name + " " + selectedUser.surname + " " + selectedUser.email}</h6> : ''}
                
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
                        value={(selectedUser.client_id !== -1) ? selectedUser.name + " " + selectedUser.surname : "Card Holder"}
                        disabled
                      />
                    </Col>
                    <Col sm={8}>
                      <Form.Label>Card No</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardnumber"
                        maxLength='16'
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
                        maxLength='5'
                        value={valid}
                        onChange={(ev) => {
                          setValid(ev.target.value)
                        }}
                      />
                    </Col>
                    <Col sm={4}>
                      <Form.Label>CVV</Form.Label>
                      <Form.Control
                        type="number"
                        name="cvv"
                        min='0'
                        max='999'
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
                        type="number"
                        name="amount"
                        min='0'
                        max='1000'
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
                        maxLength='16'
                        value={number}
                        onChange={(ev) => {
                          setNumber(ev.target.value)
                        }}

                      />
                    </Col>
                    <Col sm={4}>
                      <Form.Label>Amount(€)</Form.Label>
                      <Form.Control
                        type="number"
                        name="amount"
                        min='0'
                        max='1000'
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
                        value={(selectedUser.client_id !== -1) ? selectedUser.name + " " + selectedUser.surname : "Account Holder"}
                        disabled
                      />
                    </Col>
                    <Col sm={8}>
                      <Form.Label>IBAN</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardnumber"
                        placeholder="IBAN address"
                        maxLength='16'
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
                        maxLength='8'
                        value={cvv}
                        onChange={(ev) => {
                          setCvv(ev.target.value)
                        }}
                      />
                    </Col>
                    <Col sm={4}>
                      <Form.Label>Amount(€)</Form.Label>
                      <Form.Control
                        type="number"
                        name="amount"
                        min='0'
                        max='1000'
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

             {/*For Cash */}
             {(method === "Cash") &&
              <>
                <Form.Group>
                  <h5 className="regText" >Enter amount paid in cash</h5>
                  <Row className="justify-content-md-center">
                    <Col sm={3}>
                      <Form.Control
                        type="number"
                        name="amount"
                        min='0'
                        max='1000'
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
    <br/>
<div>
<Button variant="light"style={{'fontSize': 30,'borderStyle':'hidden','backgroundColor':"#ffb6c1",'position':'absolute' , 'right':'30px'}}onClick={props.logout}><Link to="/">LOGOUT</Link></Button></div>
   
    <Container fluid>
   <span className="d-block text-center mt-5 mb-2 display-2">
        Shop Personnel Area
      </span>
      <Row>
        <Col xs={3} md={2}>
          <ListGroup variant="flush">
            <ListGroupItem>
              <Button variant="light" style={{ 'fontSize': 25, 'borderStyle': 'hidden', 'backgroundColor': "#ffb6c1" }} onClick={() => setShow(true)}>Show products to be delivered</Button>
            </ListGroupItem>
            <ListGroupItem>
              <Button variant="light" style={{ 'fontSize': 25, 'borderStyle': 'hidden', 'backgroundColor': "#ffb6c1" }}
                onClick={(event) => {
                  history.push("/registration")
                }}
              > Make a registration for the new client </Button>
            </ListGroupItem >
            {/*Button for opening a modal form for making a wallet top up */}
            <ListGroupItem>
              <Button variant="light" style={{ 'fontSize': 25, 'borderStyle': 'hidden', 'backgroundColor': "#ffb6c1" }}
                onClick={() => { setShow(false); setSelectedTask(MODAL.ADD) }}
              > Make a top-up of the client wallet </Button>
            </ListGroupItem >
            
            <ListGroupItem>
              <Button variant="light" style={{ 'fontSize': 25, 'borderStyle': 'hidden', 'backgroundColor': "#ffb6c1" }}
                onClick={(event) => {
                  history.push("/staff-booking")
                }}
              > Make a new order for client </Button>
            </ListGroupItem >
          </ListGroup></Col>
        {(selectedTask !== MODAL.CLOSED) && <ModalWalletTopUp onSave={handleSave} clients={clients} methods={methods} onClose={handleClose} ></ModalWalletTopUp>}

        <Col xs={9} md={9}>
          {show ?   //set recharged della tabella ordini-clienti
                  <DeliverList setRecharged={props.setRecharged} orders={props.orders} clients={clients} setShow={setShow} b={b} />: <></>}
        </Col></Row>
      <br />

    </Container>

  </>

  );
}






export default EmployeePage;
