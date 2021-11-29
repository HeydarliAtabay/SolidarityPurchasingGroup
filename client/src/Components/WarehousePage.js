import API from '../API';
import PickupList from './PickupList';
import { Container, Button, Row, Col, ListGroup, ListGroupItem, Image, Modal, Form, Dropdown} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

function WarehousePage(props) {


    const [show, setShow] = useState(false);
    let b = 1;

    return (<>
        <br/>
    <div>
    <Button variant="light"style = {{'fontSize': 30,'borderStyle':'hidden','backgroundColor':"#ffb6c1",'position':'absolute' , 'right':'30px'}}onClick={props.logout}><Link to="/">LOGOUT</Link></Button></div>
       

        <Container fluid>
       <span className="d-block text-center mt-5 mb-2 display-2">
            Warehouse Personnel Area
          </span>
          <Row>
            <Col xs={3} md={2}>
            <ListGroup variant="flush">
            <ListGroupItem>
              <Button variant="light" style={{ 'fontSize': 25, 'borderStyle': 'hidden', 'backgroundColor': "#ffb6c1" }} onClick={() => setShow(true)}>Show products to be delivered for pick-up</Button>
            </ListGroupItem></ListGroup>
            </Col>
            <Col xs={9} md={9}>
          {show ?   
                  <PickupList setRecharged={props.setRecharged} orders={props.orders} setShow={setShow} b={b} />: <></>}
        </Col></Row>
             
          <br/>
    
        </Container>
    
      </>
    
      );
    }
    





export default WarehousePage;