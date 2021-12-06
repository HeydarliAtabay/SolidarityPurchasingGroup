import API from '../API';
import PickupList from './PickupList';
<<<<<<< Updated upstream
import { Container, Button,Table, Row, Col, ListGroup, ListGroupItem, Modal} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
=======
import { Container, Button,Table, Row, Col, ListGroup, ListGroupItem, Image, Modal, Form, Dropdown} from 'react-bootstrap';
import { NavLink} from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {BoxSeam} from 'react-bootstrap-icons';
>>>>>>> Stashed changes


function WarehousePage(props) {




    const [show, setShow] = useState(false);
    let b = 1;

    return (<>
        <br/>
    <div>
    <Button variant="light"style = {{'fontSize': 30,'borderStyle':'hidden','backgroundColor':"#ffb6c1",'position':'absolute' , 'right':'30px'}}onClick={props.logout}><NavLink to="/">LOGOUT</NavLink></Button></div>
       

        <Container fluid>
       <span className="d-block text-center mt-5 mb-2 display-2">
            Warehouse Personnel Area
          </span>
          { (props.userRole === "warehouse-employee") ? 
          <>
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
          </>

         : <WarehouseManagerDashboard providers = {props.providers} orders = {props.orders}></WarehouseManagerDashboard> }
    
        </Container>
    
      </>
    
      );
    }



    function WarehouseManagerDashboard( props){
      const [show, setShow] = useState(false);
      const [showSearchButton, setShowSearchButton] = useState(false);
      const [providers, setProviders] = useState([]);
      const [update, setUpdate] = useState(false);
      const [selectedProvider, setSelectedProvider] = useState([]);
      const [providerOrders, setProviderOrders] = useState([]);
      const [recharged, setRecharged] = useState(false);
      const [showM, setShowM] = useState(false);
      const [idM, setIdM] = useState([]);
      const [idPM,setIdPM] = useState([]);
      const [products,setProducts] = useState([]);

      useEffect(() => {
        const getAllProducts = async () => {
          await API.getAllConfirmedProducts()
            .then((res) => {
              setProducts(res);
              console.log(products);
            })
            .catch((err) => {
              console.log(err);
            });
        };
        getAllProducts();
      }, [update]);

      useEffect(() => {
        const getAllProviders = async () => {
          await API.getAllProviders()
            .then((res) => {
              setProviders(res);
            })
            .catch((err) => {
              console.log(err);
            });
        };
        getAllProviders();
      }, [update]);

     
      

     
      const  handleClick = async(ev) => {
        setShow(true);
        
        await API.getProviderDeliveredOrders(ev.target.id)
            .then((res) => {
              setProviderOrders(res);
              setShowSearchButton(false);
              setShow(true);
              
            })
            .catch((err) => {
              console.log(err);
            });
            
          
        };


        useEffect(() => {
          const pr = () => {
            API.getProviderDeliveredOrders(selectedProvider).then((res) => {
              setProviderOrders(res);
              setShowSearchButton(false);
              setShow(true);
              setRecharged(false)
            });
          };
          if (recharged) pr();
        }, [recharged]);

      

        const handleProviderPick = ev => {
          setShow(false);
          setSelectedProvider({id: ev.target.id,name: ev.target.name});
          setShowSearchButton(true);
          
        }
        const handleClose = ev => {
          setShowM(false);
        }
        



      return(<>
      <Table>
        <Row><h1>MANAGER DASHBOARD</h1></Row>
        <Row><h4>providers avaiable on the platform</h4></Row>
        <Row>
        {providers.map((p) => { return(<Col>{selectedProvider.id === p.id ? <Button  variant="light" style={{ 'fontSize': 25, 'borderStyle': 'hidden', 'backgroundColor': "#ffb6c1" }} id = {p.id}  name ={p.name} onClick={handleProviderPick}>{p.name}</Button> : 
                                              <Button  variant="secondary" style={{ 'fontSize': 25, 'borderStyle': 'hidden', 'backgroundColor': "#ffb6c1" }} id = {p.id}  name ={p.name} onClick={handleProviderPick}>{p.name}</Button>}</Col>)})}
        </Row>

        <Row>
          <FarmersListChoice providers={providers}></FarmersListChoice>
        </Row>

        <Row>
        
      {showSearchButton ? 
      <Button  variant="light" style={{ 'fontSize': 25, 'borderStyle': 'hidden', 'backgroundColor': "#ffb6c1" }} id = {selectedProvider.id} onClick = {handleClick} >Click to check the farmer-shipped order</Button> :
      <></>}</Row>
      </Table>
      
      
     

      <Finestra show={showM}handleClose={handleClose}id={idM}orders={props.orders}/>

      <h1>Orders sent  to the warehouse</h1>
      <FarmerShippedOrderTable setShowM = {setShowM} setIdM = {setIdM} providerOrd = {providerOrders} idM = {idM} setIdPM={setIdPM} idPM={idPM} products = {products} setRecharged={setRecharged}></FarmerShippedOrderTable>
      </>);
      }

      function FarmersListChoice(props){
        return(  
            <div>
              <div>
                <select id="dropdown" >
                  {props.providers.map((p) =>{return(<option value={p.id}>{p.name}</option>)})}
                </select>
              </div>
            </div>
          
        );
      }
    
      function FarmerShippedOrderTable(props){

        return(<ListGroup variant="flush">
        <ListGroupItem key={"hi*"} style={{'backgroundColor':"#ffb6c1",'fontSize': 20}}>
            <Row>
        <Col xs={2} md={2}>ORDER_ID</Col>
        <Col xs={2} md={2}>CLIENT_ID</Col>
        <Col xs={3} md={3}>ORDER PRODUCTS</Col>
        <Col xs={3} md={3}>PRODUCT</Col>
        </Row></ListGroupItem>

       { props.providerOrd.map((p => {return(
          <ListGroupItem>
              <Row>
              <Col xs={2} md={2}>{p.ord_id}</Col>
              <Col xs={2} md={2}>{p.cli_id}</Col>
              <Col xs={3} md={3}>
<Button variant={"light"}style={{ 'fontSize': 20, 'borderStyle': 'hidden'}}onClick={() =>{ props.setShowM(true); props.setIdM(p.ord_id); props.setIdPM(p.prod_id)}}>
show</Button></Col>
              <Col xs={3} md={3}>{p.prod_name}</Col>
              <Col><BoxSeam color="green" size={32} style={{ width: '80px', height: '30px' ,'cursor':'pointer'}} onClick={()=>{
              alert("Shipment Received confirmed");
            
             API.updateStateFarmer(p.ord_id, p.prod_name,"received").then(()=>{     
         props.setRecharged(true); setTimeout(()=>{},3000)});
                    
               }
          }/></Col>
</Row>
          </ListGroupItem>
);}))}


        
        </ListGroup>)
      }

      function Finestra(props){return(
        <> <Modal show={props.show} onHide={props.handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title >List Of Ordered Products</Modal.Title>
        </Modal.Header>
      
      {props.orders.filter(x=>x.order_id===props.id).map((s)=>
        <Modal.Body key={s.id}>
       {' '}{s.product_name.toUpperCase()}
      </Modal.Body>)}
       
        </Modal></>);}





export default WarehousePage;