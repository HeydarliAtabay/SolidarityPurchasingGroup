

import API from '../API';
import {Container,Button,Row,Col,ListGroup,ListGroupItem,Image, Modal, Form} from 'react-bootstrap';
import ris from'./reply-all-fill.svg';
import { useState } from "react";

function ModalWalletTopUp(props) {
  const { onClose, onSave, clients,methods } = props;
  const [clientId, setClientId]=useState(1)
  const [method, setMethod]=useState(methods?methods[0].method_name:"None")
  const [number, setNumber]=useState("")
  const [valid, setValid]=useState("")
  const [cvv,setCvv]=useState("")
  const [amount,setAmount]=useState(0)

  {/*Should be modified*/}
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newTransaction = Object.assign({}, {
      type:"wallet top-up",
      client_id:clientId,
      method_id:1, 
      account_num:number,
      amount: amount,
      date:"14-11-2021",
      time:"00:00",
      status:1
     });

    onSave(newTransaction)
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
      <Form.Label>Select Client</Form.Label>
      <Row>
        <Col sm={4}>
        <Form.Control
                  as="select"
                  value={clientId}
                  onChange={(ev) => {
                    setClientId(ev.target.value)
                  }}
                >
                 {
                clients.map((client)=>{
                    return(
                        <option>
                           {client.client_id}
                        </option>
                    ) })
            }
                </Form.Control>
        </Col>
        <Col sm={8}>
        <Form.Control
                type="text"
                name="description"
                placeholder=""
                value={`${clients[clientId-1].name} ${clients[clientId-1].surname} `}
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
                methods.map((method)=>{
                    return(
                        <option>
                          {method.method_name} 
                        </option>
                    ) })
            }
                </Form.Control>
    </Form.Group>

     {/*For debit/credit card payment */ }
     {(method==="Credit/debit card") && 
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
                value={`${clients[clientId-1].name} ${clients[clientId-1].surname} `}
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add a Form
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}


function EmployeePage(props){
  const {clients,methods,addTr}=props
  const MODAL = { CLOSED: -2, ADD: -1 };
  const [selectedTask, setSelectedTask] = useState(MODAL.CLOSED);

    const handleClose = () => {
        setSelectedTask(MODAL.CLOSED);
       
      }

      const handleSave = (tr) => {
        addTransaction(tr)
        setSelectedTask(MODAL.CLOSED); 
      } 
      
      function addTransaction (tr)  {
       addTr(tr)
      }   

const [show, setShow] = useState(false);
 let b="booked";
  return(<>
<br/>
<Container fluid>
  <Row className="h-25 d-inline-block">
  </Row> 
 <Row>
<Col xs={3} md={2}>
<ListGroup variant="flush"> 
<ListGroupItem key={"10000000000*"} >
<Button variant="light" style={{'fontSize': 20,'borderStyle':'hidden','backgroundColor':"#ffb6c1"}}onClick={()=>setShow(true)}>Show products to be delivered</Button>
</ListGroupItem>
{/*Button for opening a modal form for making a wallet top up */}
<ListGroupItem key={"100000000*"} >
<Button variant="light" style={{'fontSize': 20,'borderStyle':'hidden','backgroundColor':"#ffb6c1"}} 
 onClick={() =>  {setShow(false);setSelectedTask(MODAL.ADD)}}
> Make a top-up of the client wallet </Button>
</ListGroupItem >
</ListGroup></Col>
{(selectedTask !== MODAL.CLOSED) && <ModalWalletTopUp onSave={handleSave} clients={clients} methods={methods} onClose={handleClose} ></ModalWalletTopUp>} 

<Col xs={5} md={5}>
{show?<ListGroup variant="flush">
<ListGroupItem key={"1000000000000000*"} style={{'backgroundColor':"#ffb6c1"}}>
    <Row>
<Col xs={3} md={3}>ORDER_ID</Col>
<Col xs={3} md={3}>CLIENT_ID</Col>
<Col xs={3} md={3}>PRODUCT</Col>
<Col xs={3} md={3}>DELIVER</Col>
</Row></ListGroupItem>
{props.orders.filter(x=>x.state===b).map((s)=>

<ListGroupItem key={s.order_id} style={{'backgroundColor':"#ffe4e1"}}>
  <Row><Col xs={3} md={3}>{s.order_id}</Col>
<Col xs={3} md={3}>{s.client_id}</Col>
<Col xs={3} md={3}>{s.product_name}</Col>


<Col xs={3} md={3}> 
<Image src={ris} style={{'cursor':'pointer'}} onClick={()=>{
   API.updateDelivered(s.order_id).then(()=>{
       
   
          props.setRecharged(true);
          
     })
     //api->update state
//set recharged della tabella ordini-clienti
}}></Image>
</Col>
</Row>
</ListGroupItem>)

}<ListGroupItem>
<Button variant={"light"}style={{'borderStyle':'hidden','backgroundColor':"#ffb6c1",'position':'absolute' , 'right':'15px'}}onClick={()=>{setShow(false);}}>Close</Button></ListGroupItem>
</ListGroup>:<></>}
</Col></Row>
<br/>

</Container>

</>

);}






export default EmployeePage;
