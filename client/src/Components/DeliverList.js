import { Container, Button, Row, Col, ListGroup, ListGroupItem, Image, Modal, Form } from 'react-bootstrap';
import {ExclamationDiamond,Telephone, Envelope} from 'react-bootstrap-icons'
import ris from './reply-all-fill.svg';
import API from '../API'
import { useState } from "react";
import p from './circle-fill.svg';
function onlyUnique(value,index,self){
return self.indexOf(value)===index;

}
function DeliverList(props){
 const [show, setShow] = useState(false);
 const [showClient, setShowClient]= useState(false);
const [id, setId] = useState();
const [client, setClient] = useState(0)
console.log(props.clients)

let m=props.orders.map(s=>s.order_id).filter(onlyUnique);
m.reverse();
const handleClose = (x) => {
  setShow(x);
  setShowClient(x);

}
    return(<>
    <ListGroup variant="flush">
    <ListGroupItem key={"hi*"} style={{'backgroundColor':"#ffb6c1",'fontSize': 20}}>
        <Row>
    <Col xs={2} md={2}>ORDER_ID</Col>
    <Col xs={2} md={2}>CLIENT_ID</Col>
    <Col xs={3} md={3}>PRODUCTS</Col>
     <Col xs={3} md={3}>TOTAL</Col>
    <Col xs={2} md={2}>DELIVER</Col>
    </Row></ListGroupItem>
    {props.orders.map((s)=>{
     if (!m.find(x => (parseInt(x) === parseInt(s.order_id)))) {
                    return <ListGroupItem key={s.id} style={{ display: "none" }}></ListGroupItem> }
else {
let id=m[m.length-1];
let array=props.orders.filter(x=>x.order_id===id).map(x=>x.OrderPrice);
let array2=props.orders.filter(x=>x.order_id===id).map(x=>x.product_name);
let sum=0;
for (const a of array)
{sum=sum+a;}
m.pop();

  return  <ListGroupItem key={s.id} style={{'fontSize': 20}}>
      <Row><Col xs={2} md={2}>{s.order_id}</Col>
    <Col xs={2} md={2}>{s.client_id}</Col>
    <Col xs={3} md={3}>
<Button variant={"light"}style={{ 'fontSize': 20, 'borderStyle': 'hidden'}}onClick={() =>{ setShow(true); setId(s.order_id);}}>
show</Button></Col>
    
    <Col xs={3} md={3}>{sum}{' '}€</Col>
    <Col xs={2} md={2}> 
   {s.state===props.b && 
   <Image src={ris}data-testid="im" style={{ width: '80px', height: '30px' ,'cursor':'pointer'}} onClick={()=>{
    for(const a of array2){
           API.updateDelivered(id, a).then(()=>{
              
       props.setRecharged(true); setTimeout(()=>{},3000)});
                  
             }}
        }></Image>

   }
   {s.state==="pending" && 
   <ExclamationDiamond color="red" size={32} style={{ width: '80px', height: '30px' ,'cursor':'pointer'}} onClick={()=>{
    setShowClient(true);
    setClient(s.client_id)
   }}/>

   }
   
   

    </Col>
    </Row>
    </ListGroupItem>
    }}
    )}
    <ListGroupItem>
    <Button variant={"light"}style={{'fontSize': 20,'borderStyle':'hidden','backgroundColor':"#ffb6c1",'position':'absolute' , 'right':'15px'}}onClick={()=>{props.setShow(false);}}>Close</Button></ListGroupItem>
  
  </ListGroup>
    <Finestra show={show}handleClose={handleClose}id={id}orders={props.orders}/>
    <ClientModal show={showClient}handleClose={handleClose} client={client} clients={props.clients}/>
    </>
    );}


    function Finestra(props){return(
  <> <Modal show={props.show} onHide={props.handleClose} animation={false}>
  <Modal.Header closeButton>
    <Modal.Title >List Of Ordered Products</Modal.Title>
  </Modal.Header>

{props.orders.filter(x=>x.order_id===props.id).map((s)=>
  <Modal.Body key={s.id}>
 <Image src={p}style={{ width: '5px', height: '5px'}}></Image>{' '}{s.product_name.toUpperCase()}
</Modal.Body>)}
 
  </Modal></>);}


function ClientModal(props){return(
  <> 
  <Modal size="md" show={props.show} onHide={props.handleClose} animation={false}>
  <Modal.Header closeButton>
    <Modal.Title >Client Information</Modal.Title>
  </Modal.Header>
 
  {props.clients.filter(x=>x.client_id===props.client).map((s)=>
  <Modal.Body key={s.id}>
 <Row> 
 <h4>{ `${s.name} ${s.surname}`}</h4>
   </Row>
   <Row> 
     <Col sm={4}> <span style={{fontStyle:'oblique', fontSize:'22px'}}>Telephone :</span></Col>
     <Col sm={6}><h4>{ `${s.phone}`}</h4></Col>
    <Col sm={2}><Telephone color="green" size={24} style={{'cursor':'pointer'}}/></Col>
 
   </Row>
   <Row> 
   <Col sm={2}> <span style={{fontStyle:'oblique', fontSize:'22px'}}>Email:</span></Col>
     <Col sm={8}><h4>{ `${s.email}`}</h4></Col>
    <Col sm={2}><Envelope color="green" size={24} style={{'cursor':'pointer'}}/></Col>
   </Row>
</Modal.Body>)}
<Modal.Footer>
  <span style={{color:'red'}}> This order is pending due to the insufficient balance. Select the way for contacting the Client </span>
</Modal.Footer>
 
  </Modal>
  </>);}

    
    
    
    
    export default DeliverList;
