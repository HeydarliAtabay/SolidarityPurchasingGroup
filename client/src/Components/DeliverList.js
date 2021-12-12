import { Button, Row, Col, ListGroup, ListGroupItem, Image, Modal, Table } from 'react-bootstrap';
import {ExclamationDiamond,Telephone, Envelope, ChatRightText} from 'react-bootstrap-icons'
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
  {/*  
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
    console.log(s.client_id)
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

  */}  
    

    <Finestra show={show}handleClose={handleClose}id={id}orders={props.orders}/>
    <ClientModal show={showClient}handleClose={handleClose} client={client} clients={props.clients}/>
    <Table striped bordered hover variant="light" responsive="lg" size="lg">
  <thead>
    <tr>
      <th>Order id</th>
      <th>Client id</th>
      <th>Products</th>
      <th>Total</th>
      <th>Purchase Type</th>
      <th>Date & Time</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {props.orders.map((s)=>{
      if(!m.find(x=>(parseInt(x)=== parseInt(s.order_id)))){
        return <td key={s.id} style={{display:"none"}}> </td>
      }
      else {
        let id=m[m.length-1];
let array=props.orders.filter(x=>x.order_id===id).map(x=>x.OrderPrice);
let array2=props.orders.filter(x=>x.order_id===id).map(x=>x.product_name);
let sum=0;
for (const a of array)
{sum=sum+a;}
       sum=sum.toFixed(2);
m.pop();

        return (
          <>
          <tr key={s.id}>
            <td> {s.order_id}</td>
            <td>{s.client_id}</td>
            <td> 
            <Button variant={"light"}style={{ 'fontSize': 20, 'borderStyle': 'hidden'}}onClick={() =>{ setShow(true); setId(s.order_id);}}>show</Button>
            </td>
            <td>{sum}{' '} €</td>
            {s.pickup===0 ? <td>Delivery</td> : <td>Pick up</td>  }
            <td>{s.date}{' '}{s.time} </td>
            <td>
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
    console.log(s.client_id)
   }}/>
  }
  <ChatRightText size={32}  style={{ 'cursor':'pointer'}} />
            </td>
          </tr>
          </>
        )
      }
    })}

 {/*

    <Col xs={2} md={2}> 
   {s.state===props.b && 
   <Image src={ris}data-testid="im" style={{ width: '80px', height: '30px' ,'cursor':'pointer'}} onClick={()=>{
    for(const a of array2){
           API.updateDelivered(id, a).then(()=>{
              
       props.setRecharged(true); setTimeout(()=>{},3000)});
                  
             }}
        }></Image>

   }*/}
  </tbody>
</Table>
    </>
    );}


   function Finestra(props){return(
  <> <Modal show={props.show} onHide={props.handleClose} animation={false}>
  <Modal.Header closeButton>
    <Modal.Title ><Row>
    <Col xs={3} md={3}>Product</Col>
    <Col xs={3} md={3}>{' '}</Col>
    <Col xs={2} md={2}>Kilos</Col>
<Col xs={1} md={1}>{' '}</Col>
    <Col xs={2} md={2}>Price</Col></Row></Modal.Title>
  </Modal.Header>

{props.orders.filter(x=>x.order_id===props.id).map((s)=>
  <Modal.Body key={s.id}>
 <Row>
<Col xs={4} md={4}><Image src={p}style={{ width: '5px', height: '5px'}}></Image>{' '}{s.product_name.toUpperCase()}
</Col>
<Col xs={2} md={2}style={{'fontSize': 20}}> {s.order_quantity}</Col>
<Col xs={4} md={4}style={{'fontSize': 20}}>{' '} {s.OrderPrice}€</Col>
</Row>
</Modal.Body>)}
 
  </Modal></>);}



function ClientModal(props){
  const [mailerState, setMailerState] = useState({
    email: "",
    message: ""
  });
  const [emailSent, setEmailSent]=useState(false)

  const handleSubmitEmail = (event) => {

   
    API.submitEmail(mailerState).then(()=>{
    setEmailSent(true) 
    });
                 
            
  }
  return(
 
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
    <Col sm={2}>
      
    {!emailSent && 
    <>
    <Envelope color="green" size={24} style={{'cursor':'pointer'}}
    onClick={()=>{
      setMailerState((prevState) => ({
        ...prevState,
        email: s.email,
        message: `Dear ${s.name} ${s.surname}, Your order from Solidarity Purchase group is still pending, please top-up your wallet for letting us to complete your order `

        
      }));
      handleSubmitEmail();
    }}
    
    />
    </>
    } 
     {emailSent && 
    <>
    <Envelope color="gray" size={24} style={{'cursor':'pointer'}}
    onClick={()=>{
      setMailerState((prevState) => ({
        ...prevState,
        email: s.email,
        message: `Dear ${s.name} ${s.surname}, Your order from Solidarity Purchase group is still pending, please top-up your wallet for letting us to complete your order `

        
      }));
      handleSubmitEmail();
    }}
    
    />
    </>
    }
     </Col>
   </Row>
</Modal.Body>)}
<Modal.Footer>
  <span style={{color:'red'}}> This order is pending due to the insufficient balance. Select the way for contacting the Client </span>
</Modal.Footer>
 
  </Modal>
  </>);}

    
    
    
    
    export default DeliverList;
