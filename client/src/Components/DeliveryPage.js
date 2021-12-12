import API from '../API';
import { Container, Button,Table, Row, Col, ListGroup, ListGroupItem, Image, Modal, Form, Dropdown} from 'react-bootstrap';
import { NavLink} from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import {BoxSeam} from 'react-bootstrap-icons';
import ris from './reply-all-fill.svg';



function DeliveryPage(props){

    const [delivererData, setDelivererData] = useState();
    const [avaiableOrders, setAvaiableOrders] = useState([]);
    const [flag, setFlag] = useState(false);
    const [show, setShow] = useState(false);
    const [showClient, setShowClient]= useState(false);
    const [id, setId] = useState();
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
      

      let array2=props.orders.filter(x=>x.order_id===id).map(x=>x.product_name);


    return (<>
        <br/>
    <div>
    <Button variant="light"style={{'fontSize': 30,'borderStyle':'hidden','backgroundColor':"#DCDCDC",'position':'absolute' , 'right':'30px'}}onClick={props.logout}><Link to="/">LOGOUT</Link></Button></div>
  
     
  
        
        <Container fluid>
       <span className="d-block text-center mt-5 mb-2 display-2">
            Delivery Personnel Area
          </span>
          </Container>
          <h1 className="mt-3 text-center">{(avaiableOrders.length!=0)? <>There are {avaiableOrders.length} available order(s) in {delivererData.city}!</>: <>non ho letto correttamente</>}</h1> 
          <h1></h1>
          {/*
          <> userRole: {props.userRole}</>
          <> delivererId: {props.delivererId}</>
          <> mail: {props.mail}</> */}
          <Container>
            <Table>

                  {/* to change state just use this api: API.updateState(1,'tomatoes','shipped') */}

                  <thead>
                    
    <tr>
      <th>Order ID</th>
      <th>Client ID</th>
      <th>Address</th>
      <th>Zip Code</th>
      <th>City</th>
      <th>Status</th>
      <th>Confirm Shipment</th>
      <th>Confirm Payment & Delivery</th>
    </tr>
  </thead>
  
                {avaiableOrders.map((o) =>{
                      return(  <>
                        <tr key={o.id}>
                          <td> {o.order_id}</td>
                          <td>{o.client_id}</td>
                          
            <td>{o.address}</td>  
            <td>{o.zipcode}</td>  
            <td>{o.city}</td> 
            <td>{o.state}</td>   
            <td>
            {
             <Image src={ris} data-testid="im" style={{ width: '80px', height: '30px' ,'cursor':'pointer'}} onClick={()=>{
           for(const a of array2){
               API.updateState(id, a, "shipped").then(()=>{
                setTimeout(()=>{},3000)});
            }}
        }></Image>
      }
        </td>
        <td>
            {
             <Image src={ris} data-testid="im" style={{ width: '80px', height: '30px' ,'cursor':'pointer'}} onClick={()=>{
           for(const a of array2){
               API.updateState(id, a, "delivered").then(()=>{
                setTimeout(()=>{},3000)});
            }}
        }></Image>
      }
        </td>
          </tr>
          </>
                        
                  
                      );
                })}
              
            </Table>
          </Container>
          </>)
}

export default DeliveryPage;
