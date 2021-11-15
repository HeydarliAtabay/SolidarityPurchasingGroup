import { Container, Button, Row, Col, ListGroup, ListGroupItem, Image, Modal, Form } from 'react-bootstrap';
import ris from './reply-all-fill.svg';
import API from '../API'
function DeliverList(props){
    return(
    <ListGroup variant="flush">
    <ListGroupItem key={"hi*"} style={{'backgroundColor':"#ffb6c1"}}>
        <Row>
    <Col xs={3} md={3}>ORDER_ID</Col>
    <Col xs={3} md={3}>CLIENT_ID</Col>
    <Col xs={3} md={3}>PRODUCT</Col>
    <Col xs={3} md={3}>DELIVER</Col>
    </Row></ListGroupItem>
    {props.orders.filter(x=>x.state===props.b).map((s)=>
    
    <ListGroupItem key={s.order_id} style={{'backgroundColor':"#ffe4e1"}}>
      <Row><Col xs={3} md={3}>{s.order_id}</Col>
    <Col xs={3} md={3}>{s.client_id}</Col>
    <Col xs={3} md={3}>{s.product_name}</Col>
    
    
    <Col xs={3} md={3}> 
    <Image src={ris}data-testid="im" style={{'cursor':'pointer'}} onClick={()=>{
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
    <Button variant={"light"}style={{'borderStyle':'hidden','backgroundColor':"#ffb6c1",'position':'absolute' , 'right':'15px'}}onClick={()=>{props.setShow(false);}}>Close</Button></ListGroupItem>
    </ListGroup>
    
    
    );}
    
    
    
    
    
    export default DeliverList;