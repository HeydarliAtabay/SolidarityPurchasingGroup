import DeliverList from './DeliverList';
import { Container, Button, Row, Col, Modal, Form, Dropdown, Card} from 'react-bootstrap';
import { List} from 'react-bootstrap-icons'
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import API from '../API';

function ModalWalletTopUp(props) {
  const { onClose, onSave, clients, methods, setClick } = props;
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

  
  
  const SendTopUpNotificationTelegram = async (clientTelegram,transaction) => {
    const SendNotification = async () => { 
    await API.sendTelegramTopUpNotification(clientTelegram,transaction)
      .then((res) => {
        console.log("telegram message was sent to the user")
      })
      .catch((err) => {
        console.log(err);
      });
  }
  SendNotification()
  };

  {/*Should be modified*/ }
  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    let today=new Date()
    let clientToSendTeleMessage = clients.filter(eachClient=>eachClient.client_id===clientId)
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

   await onSave(newTransaction, amount, clientId)
    SendTopUpNotificationTelegram(clientToSendTeleMessage[0], newTransaction)
    setClick(false)
    //window.location.reload(false);

    
  };

  return (
    <div className="cont">
      <Modal show onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Wallet Top-up</Modal.Title>
        </Modal.Header>
        <Form onSubmit={(event)=>(handleSubmit(event))}>
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
  const [clicked, setClicked] = useState(false)
  const [clickedButtonText, setClickedButtonText] = useState("")

  const handleClose = () => {
    setSelectedTask(MODAL.CLOSED);
    setClicked(false)
    setClickedButtonText("")
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

{// <div><Button variant="light"style={{'fontSize': 30,'borderStyle':'hidden','backgroundColor':"#ffb6c1",'position':'absolute' , 'right':'30px'}}onClick={props.logout}><Link to="/">LOGOUT</Link></Button></div>
   }
    <Container fluid>
    <div >
    <h3 className="regText">Shop Personnel Area</h3>
    {/* When one of the cards were pressed */}

   {!clicked && 
   <>
   <Row className="mb-3">
          <div className="col-md-6">
            <Card className="text-center">
  <Card.Header>Orders</Card.Header>
  <Card.Body>
    <Card.Title>Check orders status</Card.Title>
    <Card.Text>
     By clicking this button you can check the list of orders with ordered products and status
    </Card.Text>
    <Button variant="primary" onClick={() => {
      setShow(true)
      setClicked(true)
      setClickedButtonText("Orders")
      }}>Show orders</Button>
  </Card.Body>
  <Card.Footer className="text-muted"></Card.Footer>
</Card>
                 </div>
                 <div className="col-md-6">
            <Card className="text-center">
  <Card.Header>Client Registration</Card.Header>
  <Card.Body>
    <Card.Title>Make a registration of the new Client</Card.Title>
    <Card.Text>
     By clicking this button you will be redirected to the Registration page, for registering new client
    </Card.Text>
    <Button variant="primary"onClick={(event) => {
                  history.push("/registration")
                  setClicked(true)
                  setClickedButtonText("Client Registration")
                }}>Go to registration page</Button>
  </Card.Body>
  <Card.Footer className="text-muted"></Card.Footer>
</Card>
           
            </div>
            </Row>
            <Row className="mb-3">
            <div className="col-md-6">
            <Card className="text-center">
  <Card.Header>Balance Top-up</Card.Header>
  <Card.Body>
    <Card.Title>Top-up the balance of the client's wallet</Card.Title>
    <Card.Text>
     By clicking this button the wallet top-up form will be opened, where you can modify the balance of the client
    </Card.Text>
    <Button variant="primary"onClick={() => { setShow(false); setSelectedTask(MODAL.ADD);  setClicked(true); setClickedButtonText("Balance Top-up") }}>Open top-up form</Button>
  </Card.Body>
  <Card.Footer className="text-muted"></Card.Footer>
</Card>
            </div>

            <div className="col-md-6">
            <Card className="text-center">
  <Card.Header>Ordering on behalf of the Client</Card.Header>
  <Card.Body>
    <Card.Title>Make an order for a specific client</Card.Title>
    <Card.Text>
     By clicking this button you will be redirected to the page where you can select the client and make an order on behalf of him/her
    </Card.Text>
    <Button variant="primary"onClick={(event) => {
                  history.push("/staff-booking")
                  setClicked(true)
                  setClickedButtonText("Ordering on behalf of the Client")
                }}>Open order page</Button>
  </Card.Body>
  <Card.Footer className="text-muted"></Card.Footer>
</Card>
            </div>  
            </Row>
   </>
   } 
   
   {clicked && 
   <>
   <Row>
     <Col sm={4}>  <List size={52} onClick={()=>{
    setClicked(false)
    setShow(false)
  }}></List> </Col>
  <Col sm={8} > <h3>{clickedButtonText} </h3></Col>
   </Row>
 
  </>
   }

      
            
        {(selectedTask !== MODAL.CLOSED) && <ModalWalletTopUp setClick={setClicked} onSave={handleSave} clients={clients} methods={methods} onClose={handleClose} ></ModalWalletTopUp>}

        <Col >
          {show ?   //set recharged della tabella ordini-clienti
                  <DeliverList setRecharged={props.setRecharged} orders={props.orders} clients={clients} setShow={setShow} b={b} time={props.time} />: <></>}
        </Col>
      <br />
    </div>
    </Container>

  </>

  );
}






export default EmployeePage;
