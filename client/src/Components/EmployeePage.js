

import API from '../API';
import {Container,Button,Row,Col,ListGroup,ListGroupItem,Image, Modal, Form} from 'react-bootstrap';
import ris from'./reply-all-fill.svg';
import { useState } from "react";

function ModalWalletTopUp(props) {
  const { onClose, onSave, clients,methods } = props;

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

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
      <Form.Control
                  as="select"
                 
                  onChange={(ev) => {
                  }}
                > 
                 {
                clients.map((client)=>{
                    return(
                        <option>
                           {`${client.client_id}. ${client.name} ${client.surname}`} 
                        </option>
                    ) })
            }
                </Form.Control>
    </Form.Group>
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
  const {clients,methods}=props
  const MODAL = { CLOSED: -2, ADD: -1 };
  const [selectedTask, setSelectedTask] = useState(MODAL.CLOSED);

    const handleClose = () => {
        setSelectedTask(MODAL.CLOSED);
       
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
{(selectedTask !== MODAL.CLOSED) && <ModalWalletTopUp clients={clients} methods={methods} onClose={handleClose} ></ModalWalletTopUp>} 

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
