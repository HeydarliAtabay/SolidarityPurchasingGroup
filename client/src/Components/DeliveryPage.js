import API from '../API';
import { Container, Button,Table, Row, Col, ListGroup, ListGroupItem, Image, Modal, Form, Dropdown} from 'react-bootstrap';
import { NavLink} from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {BoxSeam} from 'react-bootstrap-icons';

function DeliveryPage(props){
    console.log(props.id);
    return (<>
        <br/>
    <div>
    <Button variant="light"style = {{'fontSize': 30,'borderStyle':'hidden','backgroundColor':"#ffb6c1",'position':'absolute' , 'right':'30px'}}onClick={props.logout}><NavLink to="/">LOGOUT</NavLink></Button></div>
       

        <Container fluid>
       <span className="d-block text-center mt-5 mb-2 display-2">
            Warehouse Personnel Area
          </span>
          </Container>
          </>)
}

export default DeliveryPage;
