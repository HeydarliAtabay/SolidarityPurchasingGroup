import API from '../API';
import { Container, Button,Table, Row, Col, ListGroup, ListGroupItem, Image, Modal, Form, Dropdown} from 'react-bootstrap';
import { NavLink} from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import {BoxSeam} from 'react-bootstrap-icons';


function DeliveryPage(props){

    const [delivererData, setDelivererData] = useState();
    const [avaiableOrders, setAvaiableOrders] = useState([]);
    const [flag, setFlag] = useState(false);

    const [displayFlag, setDisplayFlag] = useState(false);

    

    

    useEffect(() => {
        const getDelivererByEmail = async () => {
          await API.getDelivererByMail(props.mail)
            .then((res) => {
              setDelivererData(res);
              setFlag(true);
            })
            .catch((err) => {
              console.log(err);
            });
        };
        if(props.mail)
        getDelivererByEmail();
      }, [props.mail]);

      
      // useeffect that loads all the avaiable orders in the city of the deliverer
      
      useEffect(() => {
        const getAllDeliverableOrders = async () => {
          await API.getDeliverableOrders(delivererData.city)
            .then((res) => {
              setAvaiableOrders(res);
              
            })
            .catch((err) => {
              console.log(err);
            });
        };
        if(flag && delivererData){
        getAllDeliverableOrders();
        console.log(avaiableOrders);
        }
      }, [flag,]);
      



    return (<>
        <br/>
    <div>
    <Button variant="light"style={{'fontSize': 30,'borderStyle':'hidden','backgroundColor':"#ffb6c1",'position':'absolute' , 'right':'30px'}}onClick={props.logout}><Link to="/">LOGOUT</Link></Button></div>
  
     
  
        
        <Container fluid>
       <span className="d-block text-center mt-5 mb-2 display-2">
            Warehouse Personnel Area
          </span>
          </Container>
          <h1>{(avaiableOrders.length!=0)? <>read correctly the db, there are {avaiableOrders.length} avaiable orders in {delivererData.city}!</>: <>non ho letto correttamente</>}</h1>
          <>userRole: {props.userRole}</>
          <> delivererId: {props.delivererId}</>
          <> mail: {props.mail}</>
          <Container>
            <Table>

                  {/* to change state just use this api: API.updateState(1,'tomatoes','shipped') */}


                {avaiableOrders.map((o) =>{
                      return(  <Row><Col>{o.order_id}</Col>
                              <Col>{o.city}</Col></Row>);
                })}
              
            </Table>
          </Container>
          </>)
}

export default DeliveryPage;
