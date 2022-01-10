import { Alert, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
function ClientPage(props) {

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (props.userRole !== 'client') {
      return;
    }

    const hasPendingPayment = props.orders.find((o) => (o.client_id === props.clientid && o.state === 'pending'));

    if (hasPendingPayment) {
      setShow(true);
      return;
    }

    setShow(false);


  }, [props.userRole])

  return (
    <div className="d-block my-3 mx-5 text-center">
      <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible >
        <Alert.Heading data-testid="alertH" ><h3>ATTENTION: Order status information</h3></Alert.Heading>
        <p data-testid="alert" >
          Some of your orders are still <b>pending & awaiting payment</b>. Please contact the shop to top-up your wallet!
        </p>
      </Alert>
    </div>
  );
}
export default ClientPage;
