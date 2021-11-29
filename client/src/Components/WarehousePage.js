import API from '../API';
import PickupList from './PickupList';
import { Container, Button,Table, Row, Col, ListGroup, ListGroupItem, Image, Modal, Form, Dropdown} from 'react-bootstrap';
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

          <WarehouseManagerDashboard providers = {props.providers} orders = {props.orders}></WarehouseManagerDashboard>
    
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

      const [showM, setShowM] = useState(false);
      const [idM, setIdM] = useState([]);

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
        <Row><h4>MANAGER DASHBOARD</h4></Row>
        <Row><h2>providers avaiable on the platform</h2></Row>
        <Row>
        {providers.map((p) => { return(<Col><Button  variant="light" style={{ 'fontSize': 25, 'borderStyle': 'hidden', 'backgroundColor': "#ffb6c1" }} id = {p.id}  name ={p.name} onClick={handleProviderPick}>{p.name}</Button></Col>)})}
        </Row>
        <Row>
        <Col><h4>PROVIDER SCELTO: {selectedProvider.name}</h4></Col>
      {showSearchButton ? 
      <Button id = {selectedProvider.id} onClick = {handleClick} >CLicca per vedere ordini venditore </Button> :
      <></>}</Row>
      </Table>
      
      
     

      <Finestra show={showM}handleClose={handleClose}id={idM}orders={props.orders}/>

      <h1>Orders sent  to the warehouse</h1>
      <FarmerShippedOrderTable setShowM = {setShowM} setIdM = {setIdM} providerOrd = {providerOrders}></FarmerShippedOrderTable>

      
          
      
      
      
      </>);
      }
    
      function FarmerShippedOrderTable(props){

        return(<ListGroup variant="flush">
        <ListGroupItem key={"hi*"} style={{'backgroundColor':"#ffb6c1",'fontSize': 20}}>
            <Row>
        <Col xs={2} md={2}>ORDER_ID</Col>
        <Col xs={2} md={2}>CLIENT_ID</Col>
        <Col xs={3} md={3}>PRODUCTS</Col>
        </Row></ListGroupItem>

       { props.providerOrd.map((p => {return(
          <ListGroupItem>
              <Col xs={2} md={2}>{p.ord_id}</Col>
              <Col xs={2} md={2}>{p.cli_id}</Col>
              <Col xs={3} md={3}>
<Button variant={"light"}style={{ 'fontSize': 20, 'borderStyle': 'hidden'}}onClick={() =>{ props.setShowM(true); props.setIdM(p.ord_id);}}>
show</Button></Col>
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