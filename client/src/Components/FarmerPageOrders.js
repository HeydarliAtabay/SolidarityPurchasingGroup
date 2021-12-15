import {  Button, Row, Col, Table, Image, Modal} from 'react-bootstrap';
import { useState } from "react";
import p from './circle-fill.svg';
import {Link} from 'react-router-dom'

import dayjs from 'dayjs';
function onlyUnique(value,index,self){
return self.indexOf(value)===index;

}

function Fbookings(props) {
const[show,setShow]= useState(false);
const [id,setId]= useState();
const [order,setOrder]= useState();


let c=props.time.date;

let data=dayjs(c);
let i=data.get('week');

let m=props.orders.filter(x=>x.state==="booked"&&dayjs(`${x.date}`).get('week')===i).map(s=>s.order_id).filter(onlyUnique);
m.reverse();
const handleClose = (x) => setShow(x);
    return(<>

        
         
         <Link to="/farmer">
                <Button variant="outline-warning">Back to Farmer Area</Button>
              </Link>
   
      <span className="d-block text-center mt-2 mb-1 display-1">
               Bookings
            </span>
        <h5 className="d-block mx-auto mb-5 text-center text-muted">
                        Choose a date clicking on the clock up above to see all the orders of that week 
                    </h5>



                
        <div className="card mx-5 my-5 ">
     
 <Table class="table table-bordered " bordered hover responsive="lg" size="lg"  style={{'borderColor': 'orange', 'fontSize': 23}}>
  <thead >
    <tr>
      <th>Order id</th>
      <th>Client id</th>
      <th>Products</th>
      <th>Total</th>
      <th>Purchase Type</th>
      <th>Date & Time</th>
      
    </tr>
  </thead>
<tbody>
 {props.orders.map((s)=>{
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
     <td>{s.client_id}</td>
<td>
<Button variant={"light"}style={{ 'fontSize': 20, 'borderStyle': 'hidden'}}onClick={() =>{ setShow(true); setOrder(s);setId(s.order_id);}}>
show </Button></td>
<td >{sum}{' '}€</td>
 {s.pickup===0 ? <td>Delivery</td> : <td>Pick up</td>  }
  <td>{s.date}{' '}{s.time} </td>
 
    
      </tr>

  
    }}
    )}



</tbody>
</Table>
</div>














<Modal show={show} onHide={handleClose} animation={false}>
  <Modal.Header closeButton>
    <Modal.Title >
<Row>
   <Col xs={3} md={3}>Product</Col>
<Col xs={3} md={3}>{' '}</Col>
    <Col xs={3} md={3}>Kilos</Col>
<Col xs={1} md={1}>{' '}</Col>
    <Col xs={2} md={2}>{'  '}Price</Col>
    </Row>
</Modal.Title>
  </Modal.Header>

 {props.orders.filter(x=>(x.state==="booked") && (x.order_id===id)).map((s)=>
  <Modal.Body key={s.id}>
 <Row>
<Col xs={4} md={4}><Image src={p}style={{ width: '5px', height: '5px'}}></Image>{' '}{s.product_name.toUpperCase()}
</Col>
<Col xs={3} md={3}style={{'fontSize': 20}}> {s.order_quantity}</Col>
<Col xs={3} md={3}style={{'fontSize': 20}}>{s.OrderPrice}€</Col>
</Row>
</Modal.Body>)}
  
  </Modal>



   </>
    );}
 export default Fbookings;














