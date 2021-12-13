import { Button, Row, Col, Form, Image, Modal, Table } from 'react-bootstrap';
import {ExclamationDiamond,Telephone, Envelope, ChatRightText} from 'react-bootstrap-icons'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography"
import ris from './reply-all-fill.svg';
import API from '../API'
import { useState, useEffect } from "react";
import p from './circle-fill.svg';
function onlyUnique(value,index,self){
return self.indexOf(value)===index;
}
toast.configure();
function DeliverList(props){
  const {time}=props
 const [show, setShow] = useState(false);
 const [showClient, setShowClient]= useState(false);
 const [showContact, setShowContact]= useState(false);
 const [contactType, setContactType]=useState(0)
 const [notified,setNotified]=useState(0) 
 const [pickupDate,setPickupDate] = useState({
  date: '',
  hour: '',
});
const [id, setId] = useState();
const [client, setClient] = useState(0)
let m=props.orders.map(s=>s.order_id).filter(onlyUnique);
m.reverse();
const handleClose = (x) => {
  setShow(x);
  setShowClient(x);
  setShowContact(x)
}

function ReminderToast(props){
const {client, date, time} = props
  return(
    <>
    <Row> <h5>{`Client ${client} has to pickup his/her order at ${date} ${time}`}</h5> </Row>
    <Row><> <h6>{`Please Notify this client`}</h6></> </Row>
  </>
  )
}
useEffect(() => {
  setNotified(0)
}, [time]);

    return(<>
    <Finestra show={show}handleClose={handleClose}id={id}orders={props.orders}/>
    <ClientModal show={showClient}handleClose={handleClose} client={client} clients={props.clients}/>
    <ContactModal time={time} show={showContact} handleClose={handleClose} client={client} clients={props.clients} contactType={contactType} pickUp={pickupDate}/>
    <Table striped bordered hover variant="light" responsive="lg" size="lg">
  <thead>
    <tr>
      <th>Order id</th>
      <th>Client id</th>
      <th>Products</th>
      <th>Total</th>
      <th>Purchase Type</th>
      <th>Date & Time</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {props.orders.map((s)=>{
      if(!m.find(x=>(parseInt(x)=== parseInt(s.order_id)))){
        return <td key={s.id} style={{display:"none"}}> </td>
      }
      else {let id=m[m.length-1];
let array=props.orders.filter(x=>x.order_id===id).map(x=>x.OrderPrice);
let array2=props.orders.filter(x=>x.order_id===id).map(x=>x.product_name);
let sum=0;
for (const a of array)
{sum=sum+a;}
       sum=sum.toFixed(2);
m.pop();
const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
/*if( s.pickup===1 && notified===0  ){
  setNotified(1)
  if(diffDays(new Date(s.date), new Date(time.date))===1 ){
    toast.info(<ReminderToast client={s.client_id} date={s.date} time={s.time}/>, {autoClose: 5000})
    
  };  
}*/
        return (
          <>
          <tr key={s.id}>
            <td> {s.order_id}</td>
            <td>{s.client_id} </td>
            <td> 
            <Button variant={"light"}style={{ 'fontSize': 20, 'borderStyle': 'hidden'}}onClick={() =>{ setShow(true); setId(s.order_id);}}>show</Button>
            </td>
            <td>{sum}{' '} €</td>
            {s.pickup===0 ? <td>Delivery</td> : <td>Pick up</td>  }
            {(new Date(s.date+' '+s.time)<(new Date(time.date+' '+time.hour)) && s.pickup===1 )  ? <td style={{color:"red"}}>{s.date}{' '}{s.time} </td> : <td>{s.date}{' '}{s.time} </td> }
            <td>
            {s.state===props.b && 
             <Image src={ris}data-testid="im" style={{ width: '80px', height: '30px' ,'cursor':'pointer'}} onClick={()=>{
           for(const a of array2){
               API.updateDelivered(id, a).then(()=>{
               props.setRecharged(true); setTimeout(()=>{},3000)});
            }}
        }></Image>
   }  
    {s.state==="pending" && 
    <>
   <Tooltip title={ <h6>{`Order status is pending due to insufficient balance `}</h6>  } >
   <ExclamationDiamond color="red" size={32} style={{ width: '80px', height: '30px' ,'cursor':'pointer'}} onClick={()=>{
    setShowClient(true);
    setClient(s.client_id)
    
   }}/>
   </Tooltip> 
   </>
  }
  {console.log((new Date(s.date+' '+s.time)<(new Date(time.date+' '+time.hour))))}
  {(new Date(s.date+' '+s.time)<(new Date(time.date+' '+time.hour)) && s.pickup===1 )  ? 
  <>
  <Tooltip title={
    <>    <Typography color="red">Missed Pick-up</Typography>
            <h4>{`Client didn't take his/her order at ${s.date} ${s.time} `}</h4> 
            <span>"Click to contact the client!"</span>
  </>
  }
  >
  <ChatRightText size={32} color="red"  style={{ 'cursor':'pointer'}} 
  onClick={()=>{
    setShowContact(true);
    setClient(s.client_id)
    setContactType(1)
    setPickupDate((prevState) => ({
      ...prevState,
      date: s.date,
      hour: s.time
    }));
   }}
  />
     </Tooltip>
  </>
  :
  <>
  <Tooltip title={
    <>
            <Typography>Contact client</Typography>
            <h6>{`Click to contact the client `}</h6> 
  </>
  }
  >
  <ChatRightText size={32}   style={{ 'cursor':'pointer'}} 
  onClick={()=>{
    setShowContact(true);
    setClient(s.client_id)
    setContactType(0)
    setPickupDate((prevState) => ({
      ...prevState,
      date: s.date,
      hour: s.time
    }));
   }}
  
  />
     </Tooltip>
  </>
  }
 
            </td>
          </tr>
          </>
        )
      }
    })}

 {/*
    <Col xs={2} md={2}> 
   {s.state===props.b && 
   <Image src={ris}data-testid="im" style={{ width: '80px', height: '30px' ,'cursor':'pointer'}} onClick={()=>{
    for(const a of array2){
           API.updateDelivered(id, a).then(()=>{
              
       props.setRecharged(true); setTimeout(()=>{},3000)});
                  
             }}
        }></Image>

   }*/}
  </tbody>
</Table>
    </>
    );}


   function Finestra(props){return(
  <> <Modal show={props.show} onHide={props.handleClose} animation={false}>
  <Modal.Header closeButton>
    <Modal.Title ><Row>
    <Col xs={3} md={3}>Product</Col>
    <Col xs={3} md={3}>{' '}</Col>
    <Col xs={2} md={2}>Kilos</Col>
<Col xs={1} md={1}>{' '}</Col>
    <Col xs={2} md={2}>Price</Col></Row></Modal.Title>
  </Modal.Header>

{props.orders.filter(x=>x.order_id===props.id).map((s)=>
  <Modal.Body key={s.id}>
 <Row>
<Col xs={4} md={4}><Image src={p}style={{ width: '5px', height: '5px'}}></Image>{' '}{s.product_name.toUpperCase()}
</Col>
<Col xs={2} md={2}style={{'fontSize': 20}}> {s.order_quantity}</Col>
<Col xs={4} md={4}style={{'fontSize': 20}}>{' '} {s.OrderPrice}€</Col>
</Row>
</Modal.Body>)}
 
  </Modal></>);}



function ClientModal(props){
  const [mailerState, setMailerState] = useState({
    email: "",
    message: ""
  });
  const [emailSent, setEmailSent]=useState(false)
  const handleSubmitEmail = (event) => {
   
    API.submitEmail(mailerState).then(()=>{
    setEmailSent(true) 
    });
                 
            
  }
  return(
 
  <> 
  <Modal size="md" show={props.show} onHide={props.handleClose} animation={false}>
  <Modal.Header closeButton>
    <Modal.Title >Client Information</Modal.Title>
  </Modal.Header>
 
  {props.clients.filter(x=>x.client_id===props.client).map((s)=>
  <Modal.Body key={s.id}>
 <Row> 
 <h4>{ `${s.name} ${s.surname}`}</h4>
   </Row>
   <Row> 
     <Col sm={4}> <span style={{fontStyle:'oblique', fontSize:'22px'}}>Telephone :</span></Col>
     <Col sm={6}><h4>{ `${s.phone}`}</h4></Col>
    <Col sm={2}><Telephone color="green" size={24} style={{'cursor':'pointer'}}/></Col>
 
   </Row>
   <Row> 
   <Col sm={2}> <span style={{fontStyle:'oblique', fontSize:'22px'}}>Email:</span></Col>
     <Col sm={8}><h4>{ `${s.email}`}</h4></Col>
    <Col sm={2}>
      
    {!emailSent && 
    <>
    <Envelope color="green" size={24} style={{'cursor':'pointer'}}
    onClick={()=>{
      setMailerState((prevState) => ({
        ...prevState,
        email: s.email,
        message: `Dear ${s.name} ${s.surname}, Your order from Solidarity Purchase group is still pending, please top-up your wallet for letting us to complete your order `
        
      }));
      handleSubmitEmail();
    }}
    
    />
    </>
    } 
     {emailSent && 
    <>
    <Envelope color="gray" size={24} style={{'cursor':'pointer'}}
    onClick={()=>{
      setMailerState((prevState) => ({
        ...prevState,
        email: s.email,
        message: `Dear ${s.name} ${s.surname}, Your order from Solidarity Purchase group is still pending, please top-up your wallet for letting us to complete your order `
        
      }));
      handleSubmitEmail();
    }}
    
    />
    </>
    }
     </Col>
   </Row>
</Modal.Body>)}
<Modal.Footer>
  <span style={{color:'red'}}> This order is pending due to the insufficient balance. Select the way for contacting the Client </span>
</Modal.Footer>
 
  </Modal>
  </>);}
function ContactModal(props){
  const {contactType,pickUp}=props
  const [mailerState, setMailerState] = useState({
    email: "",
    message: ""
  });
  const [shouldBeNotified, setShouldBeNotified]=useState(0)
  const [emailSent, setEmailSent]=useState(false)
  const handleSubmitEmail = (event) => {
   
    API.submitEmail(mailerState).then(()=>{
    setEmailSent(true) 
    });
                 
            
  }

  
  
  return(
 
  <> 
  <Modal size="md" show={props.show} onHide={props.handleClose} animation={false}>
  <Modal.Header closeButton>
    <Modal.Title >Client Information</Modal.Title>
  </Modal.Header>
 
  {props.clients.filter(x=>x.client_id===props.client).map((s)=>
  <Modal.Body key={s.id}>
 <Row> 
 <h4>{ `${s.name} ${s.surname}`}</h4>
   </Row>
   <Row> 
   <Col sm={2}> <span style={{fontStyle:'oblique', fontSize:'22px'}}>Email:</span></Col>
     <Col sm={8}><h4>{ `${s.email}`}</h4></Col>
   </Row>
   <Row>
    <Form.Group>
    <h4 style={{textAlign:"center"}}>Write an email</h4> 
    
     <span style={{textDecoration:'underline', textAlign:'right', 'cursor':'pointer'}} 
    onClick={()=>{
      if(contactType===1){
        setMailerState((prevState) => ({
          ...prevState,
          email: s.email,
          message: `Dear ${s.name} ${s.surname}, 

You didn't pick up your order at ${pickUp.date} ${pickUp.hour}. Please contact us if there are any problems 

Best Regards,
Solidarity Purchase Group
`

        }));
      }
      else{
        setMailerState((prevState) => ({
          ...prevState,
          email: s.email,
          message: `Dear ${s.name} ${s.surname},
          
Best Regards,
Solidarity Purchase Group
          `

        }));
  
      }
      
    }}
    > apply suggestion</span>
   
    <Form.Control
    as="textarea" 
    size="lg"
    rows={5}
    value={mailerState.message}
    onChange={(ev) => {
      setMailerState((prevState) => ({
        ...prevState,
        email: s.email,
        message: ev.target.value
      }));
    }
  }
   >
    </Form.Control>
    </Form.Group> 
   </Row>
 
<Row>
   <span style={{textDecoration:'underline', textAlign:"left", 'cursor':'pointer'}} 
    onClick={()=>{
        setMailerState((prevState) => ({
          ...prevState,
          email: s.email,
          message: `Dear ${s.name} ${s.surname},
          
Tomorrow at ${pickUp.hour} you can pick up your order from our store. We kindly ask you to come and take your order.

Please inform us, if you wouldn't be available to arrive tomorrow(${pickUp.date} ${pickUp.hour})          

Best Regards,
Solidarity Purchase Group
          `

        }));
  
      
    }}
    > Notification message about pickup 24h before</span>
   </Row> 
   
</Modal.Body>)}
<Modal.Footer>
            <Button variant="danger" onClick={()=>{
               setMailerState((prevState) => ({
                ...prevState,
                email: "",
                message: "",

              }));
              props.handleClose();
            }} >Cancel</Button>
            <Button variant="primary" onClick={()=>{
               handleSubmitEmail();
            }}>
              Send Email
            </Button>
          </Modal.Footer>
  </Modal>
  </>);}
    
    
    
    
    export default DeliverList;