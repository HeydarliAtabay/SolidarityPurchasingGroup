import API from '../API';
import { Container, Button,Table, Row, Col, ListGroup, ListGroupItem, Image, Modal, Form, Dropdown} from 'react-bootstrap';
import { NavLink} from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import {BoxSeam} from 'react-bootstrap-icons';


function DeliveryPage(props){

    const [delivererData, setDelivererData] = useState();
    const [avaiableOrders, setAvaiableOrders] = useState();
    const [flag, setFlag] = useState(false);

    /*
    useEffect(() => {
        const getDelivererByEmail = async () => {
          await API.getDelivererByMail(props.mail)
            .then((res) => {
              setDelivererData(res);
              console.log(delivererData.city);
              setFlag(true);
            })
            .catch((err) => {
              console.log(err);
            });
        };
        getDelivererByEmail();
      }, []);

      */
      // useeffect that loads all the avaiable orders in the city of the deliverer
      /*
      useEffect(() => {
        const getDeliverableOrders = async () => {
          await API.getAllDeliverableOrders('deliverer1@shop.it')
            .then((res) => {
              setAvaiableOrders(res);
              console.log(avaiableOrders.order_id);
            })
            .catch((err) => {
              console.log(err);
            });
        };
        if(flag){
        getDeliverableOrders();}
      }, [flag]);
      */



    return (<>
        <br/>
    <div>
    <Button variant="light"style={{'fontSize': 30,'borderStyle':'hidden','backgroundColor':"#ffb6c1",'position':'absolute' , 'right':'30px'}}onClick={props.logout}><Link to="/">LOGOUT</Link></Button></div>
  
       
        
        <Container fluid>
       <span className="d-block text-center mt-5 mb-2 display-2">
            Warehouse Personnel Area
          </span>
          </Container>
          <>userRole: {props.userRole}</>
          <> delivererId: {props.delivererId}</>
          <> mail: {props.mail}</>
          </>)
}

export default DeliveryPage;
