import { Button, Row, Col, Table, Image, Modal } from 'react-bootstrap';
import { useState } from "react";
import p from './circle-fill.svg';
import d from './iconDelete.svg';
import im from './pencil-fill.svg';
import API from '../API'
import {Link} from 'react-router-dom'
function onlyUnique(value,index,self){
return self.indexOf(value)===index;

}

function Orders(props) {
const[show,setShow]= useState(false);
const[show2,setShow2]= useState(false);
const [id,setId]= useState();
const [order,setOrder]= useState();


let t=parseInt(props.clientid);

let m=props.orders.filter(x=> parseInt(x.client_id) === t).map(s=>s.order_id).filter(onlyUnique);


m.reverse();
const handleClose = (x) => setShow(x);

const handleClose2 = (x) => setShow2(x);
    return(<>

      <span className="d-block text-center mt-2 mb-1 display-1">
                My Orders</span>
          
           
        <div className="card mx-5 my-5 "> <Table class="table table-bordered " bordered hover responsive="lg" size="lg"  style={{'borderColor': 'blue', 'fontSize': 23}}>
  <thead >
    <tr>
      <th>Order id</th>
      <th>Products</th>
      <th>Total</th>
      <th>Purchase Type</th>
      <th>Date & Time</th>
      <th>Status</th>
    </tr>
  </thead>
<tbody>
{props.orders.filter(x=>parseInt(x.client_id) === t).map((s)=>{
     if (!m.find(x =>(parseInt(x) === parseInt(s.order_id)))) {
                    return <td key={s.id}style={{ display: "none" }}></td> }
else {
let id1=m[m.length-1];
let array=props.orders.filter(x=>x.order_id===id1).map(x=>x.OrderPrice);
let sum=0;
for (const a of array)
{sum=sum+a;}

sum=sum.toFixed(2);
m.pop();

  return  <tr key={s.id} style={{'fontSize': 20}}>
      <td>{s.order_id}</td>
   
 <td>
{s.state==="booked"?

<Button variant={"light"}style={{ 'fontSize': 20, 'borderStyle': 'hidden'}}onClick={() =>{ setShow(true); setOrder(s);setId(s.order_id);}}>
show{' / '}edit </Button>:
<Button variant={"light"}style={{ 'fontSize': 20, 'borderStyle': 'hidden'}}onClick={() =>{ setShow2(true); setOrder(s);setId(s.order_id);}}>
show </Button>

}
</td>
    
 <td >{sum}{' '}€</td>
 {s.pickup===0 ? <td>Delivery</td> : <td>Pick up</td>  }
  <td>{s.date}{' '}{s.time} </td>
 <td> {s.state}</td>
    
    
    </tr>
    }}
    )}



</tbody>
</Table>         
        </div >






<Modal show={show} onHide={handleClose} animation={false}>
  <Modal.Header closeButton>
    <Modal.Title >
<Row>
    <Col xs={4} md={4}style={{'fontSize': 24}}>Product</Col>
    <Col xs={2} md={2}style={{'fontSize': 24}}>Kilos</Col>
    <Col xs={2} md={2}style={{'fontSize': 24}}>Price</Col>
    <Col xs={2} md={2}style={{'fontSize': 24}}>Edit</Col>
    <Col xs={2} md={2}style={{'fontSize': 24}}>Delete</Col>
    </Row>
</Modal.Title>
  </Modal.Header>

 {props.orders.filter(x=>(x.state==="booked") && (x.order_id===id)&&(x.client_id===parseInt(props.clientid))).map((s)=>
  <Modal.Body key={s.id}>
 <Row>
<Col xs={4} md={4}><Image src={p}style={{ width: '5px', height: '5px'}}></Image>{' '}{s.product_name.toUpperCase()}
</Col>
<Col xs={1} md={1}style={{'fontSize': 20}}> {s.order_quantity}</Col>
<Col xs={2} md={2}style={{'fontSize': 20}}>{' '} {s.OrderPrice}€</Col>
<Col xs={2} md={2}> <Link to={{pathname:"/booking",state:{item: s, status: 'update'}}}><Image src={im}style={{'cursor':'pointer',width: '20px', height: '20px'}}></Image></Link></Col>
<Col xs={2} md={2}> <Image src={d} style={{'cursor':'pointer',width: '20px', height: '20px'}} onClick={()=>{

API.deleteOrderItem(s.id).then(()=>{props.setRecharged(true);});

}}></Image></Col></Row>
</Modal.Body>)}
  <Modal.Footer> 
<Link to={{pathname:"/booking",state:{item: order, status: 'add'}}}>
<Button variant={"primary"}>Add new products</Button></Link>

    <Button variant={"secondary"}onClick={()=>{setShow(false);}}>Close</Button>
  

</Modal.Footer>
  </Modal>

{/*modal number 2*/}
<Modal show={show2} onHide={handleClose2} animation={false}>
  <Modal.Header closeButton>
    <Modal.Title >
<Row>
    <Col xs={3} md={3}>Product</Col>
    <Col xs={3} md={3}>{' '}</Col>
    <Col xs={2} md={2}>Kilos</Col>
<Col xs={1} md={1}>{' '}</Col>
    <Col xs={2} md={2}>Price</Col>
   
    </Row>
</Modal.Title>
  </Modal.Header>

 {props.orders.filter(x=>(x.order_id===id)&&(x.client_id===parseInt(props.clientid))).map((s)=>
  <Modal.Body key={s.id}>
 <Row>
<Col xs={4} md={4}><Image src={p}style={{ width: '5px', height: '5px'}}></Image>{' '}{s.product_name.toUpperCase()}
</Col>
<Col xs={2} md={2}style={{'fontSize': 20}}> {s.order_quantity}</Col>
<Col xs={4} md={4}style={{'fontSize': 20}}>{' '} {s.OrderPrice}€</Col>
</Row>
</Modal.Body>)}
 
  </Modal>



   </>
    );}
 export default Orders;
