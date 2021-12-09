import { Container, Button, Row, Col, ListGroup, ListGroupItem, Image, Modal, Form } from 'react-bootstrap';
import { useState } from "react";
import p from './circle-fill.svg';
import d from './iconDelete.svg';
import im from './pencil-fill.svg';
import API from '../API'
import {Link} from 'react-router-dom'

import dayjs from 'dayjs';
import { useHistory } from "react-router-dom";
function onlyUnique(value,index,self){
return self.indexOf(value)===index;

}

function Fbookings(props) {
const[show,setShow]= useState(false);
const [id,setId]= useState();
const [order,setOrder]= useState();


const history = useHistory();

let c=props.time.date;

let data=dayjs(c);
let i=data.get('week');

let m=props.orders.filter(x=>x.state==="booked"&&dayjs(`${x.date}`).get('week')===i).map(s=>s.order_id).filter(onlyUnique);
m.reverse();
const handleClose = (x) => setShow(x);
    return(<>
      <span className="d-block text-center mt-5 mb-2 display-2">
               Bookings
            </span>
<Row>

<Col xs={3} md={2}>
          <ListGroup variant="flush">
           
            <ListGroupItem>
              <Button variant="light" style={{ 'fontSize': 25, 'borderColor': 'black'}}
                onClick={(event) => {
                  history.push("/farmer")
                }}
              >Back to my Area{'   '}  </Button></ListGroupItem></ListGroup>
</Col><Col xs={8} md={8}>
    <ListGroup variant="flush">
     <ListGroupItem key={"ciao7"}variant ={"light"}style={{ 'fontSize': 25,'borderColor': 'black'}}></ListGroupItem>
   <ListGroupItem key={"ciao"}variant ={"light"}style={{'borderColor': 'black'}}>
<Row>
    <Col xs={4} md={4}>ORDER_ID</Col>
    <Col xs={4} md={4}>PRODUCTS</Col>
    <Col xs={4} md={4}>TOTAL</Col>
   
    </Row>


</ListGroupItem>
    {props.orders.map((s)=>{
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
      <Row><Col xs={4} md={4}>{s.order_id}</Col>
   
    <Col xs={4} md={4}>
<Button variant={"light"}style={{ 'fontSize': 20, 'borderStyle': 'hidden'}}onClick={() =>{ setShow(true); setOrder(s);setId(s.order_id);}}>
show </Button></Col>
    
    <Col xs={4} md={4}>


 {sum}{' '}€</Col>
 
    
    </Row>
    </ListGroupItem>
    }}
    )}
  
  </ListGroup></Col></Row>

<Modal show={show} onHide={handleClose} animation={false}>
  <Modal.Header closeButton>
    <Modal.Title >
<Row>
   <Col xs={3} md={3}>Product</Col>
<Col xs={3} md={3}>{' '}</Col>
    <Col xs={3} md={3}>Kilos</Col>
<Col xs={1} md={1}>{' '}</Col>
    <Col xs={2} md={2}>{'  '}Price</Col>
    </Row>
</Modal.Title>
  </Modal.Header>

 {props.orders.filter(x=>(x.state==="booked") && (x.order_id===id)).map((s)=>
  <Modal.Body key={s.id}>
 <Row>
<Col xs={4} md={4}><Image src={p}style={{ width: '5px', height: '5px'}}></Image>{' '}{s.product_name.toUpperCase()}
</Col>
<Col xs={3} md={3}style={{'fontSize': 20}}> {s.order_quantity}</Col>
<Col xs={3} md={3}style={{'fontSize': 20}}>{s.OrderPrice}€</Col>
</Row>
</Modal.Body>)}
  
  </Modal>



   </>
    );}
 export default Fbookings;
