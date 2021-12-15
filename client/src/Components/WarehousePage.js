import API from '../API';
import PickupList from './PickupList';
import { Container, Button, Table, Row, Col, ListGroup, ListGroupItem, Modal} from 'react-bootstrap';
import { Link} from 'react-router-dom';
import { useState, useEffect } from "react";
import {BoxSeam} from 'react-bootstrap-icons';

function WarehousePage(props) {

    const [show, setShow] = useState(false);
    let b = 1;

    return (<>
        <br/>
    <div>
    
    <Button variant="light"style={{'fontSize': 30,'borderStyle':'hidden','backgroundColor':"#DCDCDC",'position':'absolute' , 'right':'30px'}}onClick={props.logout}><Link to="/">LOGOUT</Link></Button></div>

        <Container fluid>
       <span className="d-block text-center mt-5 mb-2 display-2">Warehouse Personnel Area</span>
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
          {show ? <PickupList setRecharged={props.setRecharged} orders={props.orders} userRole={props.userRole} setShow={setShow} b={b} />: <></>}
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

      let b = 1;
      
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

        useEffect(() => {
          const pr = () => {
            API.getProviderDeliveredOrders(selectedProvider.id).then((res) => {
              setProviderOrders(res);
            });
          };
          if (recharged){ 
              pr();
              setRecharged(false)}
        }, [recharged]);

      

        const handleProviderPick = async(ev) => {
          setShow(false);
          setSelectedProvider({id: ev.target.id,name: ev.target.name});
          setShowSearchButton(true);

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
            
          
        }
        const handleClose = ev => {
          setShowM(false);
        }
        


      return(<>
        <Row><h1 className="mt-3 text-center">MANAGER DASHBOARD</h1></Row>
        <>
          <Row>
          <Row><h2 className="mt-3">Orders to be Prepared</h2></Row>
            <Col className="mt-3 text-center" xs={20} md={20}>  
                  <PickupList setRecharged={props.setRecharged} orders={props.orders} setShow={setShow} b={b} />
        </Col>
        
        </Row>
             
          <br/>
          </>
        <Row><h2>Providers Available on the Platform</h2></Row>
        <Row>
        {providers.map((p) => { return(<Col>{selectedProvider.id === p.id ? <Button  variant="light" style={{ 'fontSize': 25, 'borderStyle': 'hidden', 'backgroundColor': "	#708090" }} id = {p.id}  name ={p.name} onClick={handleProviderPick}>{p.name}</Button> : 
                                              <Button  variant="secondary" style={{ 'fontSize': 25, 'borderStyle': 'hidden', 'backgroundColor': "#708090" }} id = {p.id}  name ={p.name} onClick={handleProviderPick}>{p.name}</Button>}</Col>)})}
        </Row>


      <Finestra show={showM}handleClose={handleClose}id={idM}orders={props.orders}/>

      {show ? <><h2 className="mt-5 mb-2">Orders sent to the warehouse from {selectedProvider.name}</h2>
      <FarmerShippedOrderTable setShowM = {setShowM} setIdM = {setIdM} providerOrd = {providerOrders} idM = {idM} setIdPM={setIdPM} idPM={idPM} products = {products} setRecharged={setRecharged}></FarmerShippedOrderTable>
      </> : <></>}

      
      </>);
      }
    
      function FarmerShippedOrderTable(props){

        let farmerState = 'received';

        return(<ListGroup variant="flush">
          <Container className="table-responsive text-center">
                  <Table responsive="lg" size="lg">
        <ListGroupItem key={"hi*"} style={{'backgroundColor':"#A9A9A9",'fontSize': 20}}>
          <Row>
        <Col xs={2} md={2}>ORDER ID</Col>
        <Col xs={2} md={2}>CLIENT ID</Col>
        <Col xs={2} md={2}>CLIENT NAME</Col>
        <Col xs={2} md={2}>ORDERED PRODUCTS</Col>
        <Col xs={2} md={2}>PRODUCT</Col>
        <Col xs={2} md={2}>CONFIRM</Col>
        </Row></ListGroupItem>

       { props.providerOrd.map((p => {return(
          <ListGroupItem>
              <Row>
              <Col xs={2} md={2}>{p.ord_id}</Col>
              <Col xs={2} md={2}>{p.cli_id}</Col>
              <Col xs={2} md={2}>{p.client_name} {p.client_surname}</Col>
              <Col xs={2} md={2}>
<Button variant={"light"}style={{ 'fontSize': 20, 'borderStyle': 'hidden'}}onClick={() =>{ props.setShowM(true); props.setIdM(p.ord_id); props.setIdPM(p.prod_id)}}>
show</Button></Col>
              <Col xs={2} md={2}>{p.prod_name}</Col>
              <Col><BoxSeam color="green" size={32} style={{ width: '80px', height: '30px' ,'cursor':'pointer'}} onClick={()=>{
              alert("Shipment Received confirmed");
            
             API.updateStateFarmer(p.ord_id, p.prod_name,farmerState).then(()=>{     
         props.setRecharged(true); setTimeout(()=>{console.log("Shipment received confirmed")},3000)});
                    
               }
          }/></Col>
</Row>
          </ListGroupItem>
);}))}

</Table>
        </Container>
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