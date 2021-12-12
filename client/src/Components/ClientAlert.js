import { Alert,Container,Row } from "react-bootstrap";
import { useState } from "react";
function ClientPage(props) {
  const [show, setShow] = useState(true);
  
let t=parseInt(props.clientid);
let wallet=props.clients.filter(x=>x.client_id===parseInt(props.clientid)).map(x=>x.budget);
let amount=wallet[0];
let somma=0,flag;
let itemsAmount=props.orders.filter(x=>x.client_id===parseInt(props.clientid)).map(x=>x.OrderPrice);
for(const b of itemsAmount){
somma=somma+b;
}

if(amount>=somma) flag=0;
else flag=1;
return (<>
    <br/>
    <Container fluid="sx">
  <Row className="justify-content-md-center">

  {props.clients.find(s=>(s.client_id===t&&s.budget===0.0))||flag===1?
  <>
  {show?
      <Alert style={{'backgroundColor':"#dc143c", 'width':"600px"}} onClose={() => setShow(false)} dismissible >
        <Alert.Heading data-testid="alertH"style={{'fontSize': 22, 'color':"white", 'text-align':"center"}}>-ATTENTION-</Alert.Heading>
        <p data-testid="alert" style={{'fontSize': 22, 'color':"white", 'text-align':"center"}}>
          Your wallet balance is insufficient. Please top it up!
        </p>
      </Alert>:<></>}</>:<></>}</Row></Container>
  </>  );
  }
 export default ClientPage;
