import { Container, Button, Row, Col, ListGroup, ListGroupItem, Image, Modal, Form } from 'react-bootstrap'; 
import { useState } from "react";
import p from './circle-fill.svg';
import d from './iconDelete.svg';
import im from './pencil-fill.svg';
import API from '../API'
import {Link} from 'react-router-dom'
function onlyUnique(value,index,self){
return self.indexOf(value)===index;

}
function Orders(props) {
const[show,setShow]= useState(false);
const [id,setId]= useState();
let t=parseInt(props.clientid);

let m=props.orders.filter(x=>x.state==="booked"&& parseInt(x.client_id) === t).map(s=>s.order_id).filter(onlyUnique);
m.reverse();
const handleClose = (x) => setShow(x);
    return(<>
      <span className="d-block text-center mt-5 mb-2 display-2">
                Orders
            </span>
<Row><Col xs={6} md={6}>
    <ListGroup variant="flush">
   <ListGroupItem key={"ciao"}variant ={"secondary"}style={{ 'fontSize': 25}}>List of my booked orders</ListGroupItem>
    {props.orders.filter(x=>x.state==="booked" && parseInt(x.client_id) === t).map((s)=>{
     if (!m.find(x =>(parseInt(x) === parseInt(s.order_id)))) {
                    return <ListGroupItem key={s.id}style={{ display: "none" }}></ListGroupItem> }
else {
let id=m[m.length-1];
let array=props.orders.filter(x=>x.order_id===id).map(x=>x.OrderPrice);
let sum=0;
for (const a of array)
{sum=sum+a;}
m.pop();

  return  <ListGroupItem key={s.id} style={{'fontSize': 20}}>
      <Row><Col xs={4} md={4}>ORDER_ID: {s.order_id}</Col>
   
    <Col xs={4} md={4}>
<Button variant={"light"}style={{ 'fontSize': 20, 'borderStyle': 'hidden'}}onClick={() =>{ setShow(true); setId(s.order_id);}}>
show products</Button></Col>
    
    <Col xs={4} md={4}>



TOTAL: {sum}{' '}€</Col>
    
    </Row>
    </ListGroupItem>
    }}
    )}
  
  </ListGroup></Col>
{show?
<><Col xs={4} md={4}>
 <ListGroup variant="flush">
 <ListGroupItem key={"ciaoo"}style={{ 'fontSize': 25}}variant ={"secondary"}>Products</ListGroupItem>
    {props.orders.filter(x=>(x.state==="booked") && (x.order_id===id)&&(x.client_id===parseInt(props.clientid))).map((s)=>
<ListGroupItem key={s.id} style={{'fontSize': 20}}> 
<Row>
<Col xs={6} md={6}><Image src={p}style={{ width: '5px', height: '5px'}}></Image>{' '}{s.product_name.toUpperCase()}
</Col>
<Col xs={2} md={2}> {'   '}</Col>
<Col xs={2} md={2}> <Link to={{pathname:"/booking",state:{item: s}}}><Image src={im}style={{'cursor':'pointer'}}></Image></Link></Col>
<Col xs={2} md={2}> <Image src={d} style={{'cursor':'pointer'}} onClick={()=>{
API.deleteOrderItem(s.id).then(()=>{props.setRecharged(true);});

}}></Image></Col></Row>
 </ListGroupItem>)}
  <ListGroupItem>
    <Button variant={"secondary"}style={{'fontSize':20,'borderStyle':'hidden','position':'absolute' , 'right':'15px'}}onClick={()=>{setShow(false);}}>Close</Button></ListGroupItem>
  
 </ListGroup>
 </Col></>
:<></>}</Row>
   </>
    );}
 export default Orders;
