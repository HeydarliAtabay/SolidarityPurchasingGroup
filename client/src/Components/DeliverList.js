import { Container, Button, Row, Col, ListGroup, ListGroupItem, Image, Modal, Form } from 'react-bootstrap';
import ris from './reply-all-fill.svg';
import API from '../API'
function DeliverList(props){
    return(
    <ListGroup variant="flush">
    <ListGroupItem key={"hi*"} style={{'backgroundColor':"#ffb6c1",'fontSize': 20}}>
        <Row>
    <Col xs={3} md={3}>ORDER_ID</Col>
    <Col xs={3} md={3}>CLIENT_ID</Col>
    <Col xs={4} md={4}>PRODUCTS</Col>
    <Col xs={2} md={2}>DELIVER</Col>
    </Row></ListGroupItem>
    {props.orders.filter(x=>x.state===props.b).map((s)=>
    
    <ListGroupItem key={s.order_id} style={{'fontSize': 20}}>
      <Row><Col xs={3} md={3}>{s.order_id}</Col>
    <Col xs={3} md={3}>{s.client_id}</Col>
    <Col xs={4} md={4}>{s.product_name}</Col>
    
    
    <Col xs={2} md={2}> 
    <Image src={ris}data-testid="im" style={{ width: '80px', height: '30px' ,'cursor':'pointer'}} onClick={()=>{
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
    <Button variant={"light"}style={{'fontSize': 20,'borderStyle':'hidden','backgroundColor':"#ffb6c1",'position':'absolute' , 'right':'15px'}}onClick={()=>{props.setShow(false);}}>Close</Button></ListGroupItem>
    </ListGroup>
    
    
    );}
    
    
    
    
    
    export default DeliverList;
