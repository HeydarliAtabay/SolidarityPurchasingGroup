
import API from './API';

import {Container,Button,Row,Col,ListGroup,ListGroupItem,Image} from 'react-bootstrap';

import ris from'./reply-all-fill.svg';
import { useState } from "react";

function EmployeePage(props){

const [show, setShow] = useState(false);

 let b="booked";
  return(<>
<br/>
<Container fluid>
  <Row className="h-25 d-inline-block">
  </Row> 
 <Row>
<Col xs={2} md={2}>
<Button variant="light" style={{'fontSize': 20,'borderStyle':'hidden','backgroundColor':"#9370db"}}onClick={()=>setShow(true)}>Show products to be delivered</Button></Col>
<Col xs={4} md={4}>
{show?<ListGroup variant="flush">
<ListGroupItem key={"1000000000000000"} style={{'backgroundColor':"#9370db"}}>
    <Row>
<Col xs={3} md={3}>ORDER_ID</Col>
<Col xs={3} md={3}>CLIENT_ID</Col>
<Col xs={3} md={3}>PRODUCT</Col>
<Col xs={3} md={3}>DELIVER</Col>
</Row></ListGroupItem>
{props.orders.filter(x=>x.state===b).map((s)=>

<ListGroupItem key={s.order_id} style={{'backgroundColor':"#dda0dd"}}>
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
<Button style={{'borderStyle':'hidden','backgroundColor':"#9370db",'position':'absolute' , 'right':'15px'}}onClick={()=>{setShow(false);}}>Close</Button></ListGroupItem>
</ListGroup>:<></>}
</Col></Row>
<br/>

</Container>

</>

);}






export default EmployeePage;