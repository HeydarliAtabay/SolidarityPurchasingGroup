import { Button, Row, Col, Form, Image, Modal, Table } from 'react-bootstrap';
import {ExclamationDiamond,Telephone, Envelope, ChatRightText} from 'react-bootstrap-icons'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography"
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ris from './reply-all-fill.svg';
import API from '../API'
import { useState } from "react";
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
 const [shouldBeNotified, setShouldBeNotified]=useState(0)
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
    return(<>
    <Finestra show={show}handleClose={handleClose}id={id}orders={props.orders}/>
    <ClientModal show={showClient}handleClose={handleClose} client={client} clients={props.clients}/>
    <ContactModal notify={shouldBeNotified} show={showContact} handleClose={handleClose} client={client} clients={props.clients} contactType={contactType} pickUp={pickupDate}/>
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
      else {let id1=m[m.length-1];
let array=props.orders.filter(x=>x.order_id===id1).map(x=>x.OrderPrice);
let array2=props.orders.filter(x=>x.order_id===id1).map(x=>x.product_name);
let sum=0;
for (const a of array)
{sum=sum+a;}
       sum=sum.toFixed(2);
m.pop();
        return (
          <>
         {(Math.ceil(Math.abs((new Date(s.date)-new Date(time.date)))/(1000 * 60 * 60 * 24))<=1)? 
        <>
        <Tooltip title={<h6>{` Pleasy notify the client about tomorrow's pick up `}</h6>}>
 <tr key={s.id} style={{color:"blue", fontSize:20, cursor:'pointer'}}>
         
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
               props.setRecharged(true); setTimeout(()=>{console.log("Delivered")},3000)});
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
    setShouldBeNotified(0)
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
    if(Math.ceil(Math.abs((new Date(s.date)-new Date(time.date)))/(1000 * 60 * 60 * 24))<=1){
      setShouldBeNotified(1)
      console.log("It will changed to 1")
    }
    else{
      setShouldBeNotified(0)
    }

    
    setPickupDate((prevState1) => ({
      ...prevState1,
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
         </Tooltip>

        
         </>
         :
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
             <Image src={ris}data-testid="im1" style={{ width: '80px', height: '30px' ,'cursor':'pointer'}} onClick={()=>{
           for(const a of array2){
               API.updateDelivered(id, a).then(()=>{
               props.setRecharged(true); setTimeout(()=>{"Delivered Successfully"},3000)});
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
    setShouldBeNotified(0)
    setPickupDate((prevState2) => ({
      ...prevState2,
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
    if(Math.ceil(Math.abs((new Date(s.date)-new Date(time.date)))/(1000 * 60 * 60 * 24))<=1){
      setShouldBeNotified(1)
    }
    else{
      setShouldBeNotified(0)
    }

    
    setPickupDate((prevState3) => ({
      ...prevState3,
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
         }
          </>
        )
      }
    })}
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
  const [openDialog, setOpenDialog]=useState(false)
  const [emailSent, setEmailSent]=useState(false)
  const handleSubmitEmail = (event) => {
    API.submitEmail(mailerState).then(()=>{
    setEmailSent(true) 
    setOpenDialog(false)
    });         
  }

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  function changeEmailState(client){
    setMailerState((prevState) => ({
      ...prevState,
      email: client.email,
      message: `Dear ${client.name} ${client.surname}, 
Your order from Solidarity Purchase group is still pending, please top-up your wallet for letting us to complete your order 

Best Regards,
Solidarity Purchase Group
`
      
    }));
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
      changeEmailState(s)
      handleOpenDialog()
    }}
    
    />
    </>
    } 
     {emailSent && 
    <>
    <Envelope color="gray" size={24} style={{'cursor':'pointer'}} disabled />
    </>
    }
     </Col>
   </Row>
</Modal.Body>)}
<Modal.Footer>
  <span style={{color:'red'}}> This order is pending due to the insufficient balance. Select the way for contacting the Client </span>
</Modal.Footer>
 
  </Modal>

  <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Accepting email sending"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to send an email to the Client, about insufficient balance?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Disagree</Button>
          <Button onClick={handleSubmitEmail} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

  </>);}
function ContactModal(props){
  const {contactType,pickUp, notify}=props
  const [mailerState, setMailerState] = useState({
    email: "",
    message: ""
  });
  const handleSubmitEmail = (event) => {
   
    API.submitEmail(mailerState).then(()=>{
      console.log("Mail sent correctly")
    });
                 
            
  }

  
  console.log(notify)
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
 {notify===1 &&
 <>
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
 </>
 }

   
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