import { Container, Button, Row, Col, ListGroup, ListGroupItem, Image, Modal, Form } from 'react-bootstrap';
import { useState } from "react";
import p from './circle-fill.svg';
import d from './iconDelete.svg';
import im from './pencil-fill.svg';
import API from '../API'
import {Link} from 'react-router-dom'

import { useHistory } from "react-router-dom";
function onlyUnique(value,index,self){
return self.indexOf(value)===index;

}

function Orders(props) {
const[show,setShow]= useState(false);
const [id,setId]= useState();
const [order,setOrder]= useState();


const history = useHistory();

let t=parseInt(props.clientid);

let m=props.orders.filter(x=>x.state==="booked"&& parseInt(x.client_id) === t).map(s=>s.order_id).filter(onlyUnique);
m.reverse();
const handleClose = (x) => setShow(x);
    return(<>
      <span className="d-block text-center mt-5 mb-2 display-2">
                My Orders
            </span>
<Row>

<Col xs={3} md={2}>
          <ListGroup variant="flush">
            <ListGroupItem>
            <Button variant="light" style={{ 'fontSize': 25, 'borderColor': 'black'}}
                onClick={(event) => {
                  history.push("/booking")
                }}
              > Make a new Order </Button>
            </ListGroupItem>
            <ListGroupItem>
              <Button variant="light" style={{ 'fontSize': 25, 'borderColor': 'black'}}
                onClick={(event) => {
                  history.push("/client")
                }}
              >Back to my Area{'   '}  </Button></ListGroupItem></ListGroup>
</Col><Col xs={10} md={10}>
    <ListGroup variant="flush">
     <ListGroupItem key={"ciao7"}variant ={"light"}style={{ 'fontSize': 25,'borderColor': 'black'}}></ListGroupItem>
   <ListGroupItem key={"ciao"}variant ={"light"}style={{ 'fontSize': 25,'borderColor': 'black'}}>
<Row>
    <Col xs={3} md={3}style={{'fontSize': 25}}>ORDER_ID</Col>
    <Col xs={3} md={3}style={{'fontSize': 25}}>PRODUCTS</Col>
    <Col xs={3} md={3}style={{'fontSize': 25}}>TOTAL</Col>
    <Col xs={3} md={3}style={{'fontSize': 25}}>STATE</Col>
   
    </Row>


</ListGroupItem>
    {props.orders.filter(x=>parseInt(x.client_id) === t).map((s)=>{
     if (!m.find(x =>(parseInt(x) === parseInt(s.order_id)))) {
                    return <ListGroupItem key={s.id}style={{ display: "none" }}></ListGroupItem> }
else {
let id=m[m.length-1];
let array=props.orders.filter(x=>x.order_id===id).map(x=>x.OrderPrice);
let sum=0;
for (const a of array)
{sum=sum+a;}

sum=sum.toFixed(2);
m.pop();

  return  <ListGroupItem key={s.id} style={{'fontSize': 20}}>
      <Row><Col xs={3} md={3}>{s.order_id}</Col>
   
    <Col xs={3} md={3}>
<Button variant={"light"}style={{ 'fontSize': 20, 'borderStyle': 'hidden'}}onClick={() =>{ setShow(true); setOrder(s);setId(s.order_id);}}>
show{' / '}edit </Button></Col>
    
    <Col xs={3} md={3}>


 {sum}{' '}€</Col>
 <Col xs={3} md={3}>


 {s.state}</Col>
    
    </Row>
    </ListGroupItem>
    }}
    )}
  
  </ListGroup></Col></Row>

<Modal show={show} onHide={handleClose} animation={false}>
  <Modal.Header closeButton>
    <Modal.Title >
<Row>
    <Col xs={4} md={4}style={{'fontSize': 24}}>Product</Col>
    <Col xs={2} md={2}style={{'fontSize': 24}}>Qty</Col>
    <Col xs={2} md={2}style={{'fontSize': 24}}>Price</Col>
    <Col xs={2} md={2}style={{'fontSize': 24}}>Edit</Col>
    <Col xs={2} md={2}style={{'fontSize': 24}}>Delete</Col>
    </Row>
</Modal.Title>
  </Modal.Header>

 {props.orders.filter(x=>(x.state==="booked") && (x.order_id===id)&&(x.client_id===parseInt(props.clientid))).map((s)=>
  <Modal.Body key={s.id}>
 <Row>
<Col xs={4} md={4}><Image src={p}style={{ width: '5px', height: '5px'}}></Image>{' '}{s.product_name.toUpperCase()}
</Col>
<Col xs={1} md={1}style={{'fontSize': 20}}> {s.order_quantity}</Col>
<Col xs={2} md={2}style={{'fontSize': 20}}>{' '} {s.OrderPrice}</Col>
<Col xs={2} md={2}> <Link to={{pathname:"/booking",state:{item: s, status: 'update'}}}><Image src={im}style={{'cursor':'pointer',width: '20px', height: '20px'}}></Image></Link></Col>
<Col xs={2} md={2}> <Image src={d} style={{'cursor':'pointer',width: '20px', height: '20px'}} onClick={()=>{

API.deleteOrderItem(s.id).then(()=>{props.setRecharged(true);});

}}></Image></Col></Row>
</Modal.Body>)}
  <Modal.Footer> 
<Link to={{pathname:"/booking",state:{item: order, status: 'add'}}}>
<Button variant={"primary"}>Add</Button></Link>

    <Button variant={"secondary"}onClick={()=>{setShow(false);}}>Close</Button>
  

</Modal.Footer>
  </Modal>



   </>
    );}
 export default Orders;
