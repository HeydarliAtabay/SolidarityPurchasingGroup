import API from '../API';
import { Container, Button, Table, Image } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ris from './reply-all-fill.svg';



function DeliveryPage(props) {

  const [delivererData, setDelivererData] = useState();
  const [avaiableOrders, setAvaiableOrders] = useState([]);
  const [flag, setFlag] = useState(false);


  const [updated, setUpdated] = useState(false);





  useEffect(() => {
    const getDelivererByEmail = async () => {
      console.log(props.mail);
      await API.getDelivererByMail(props.mail)
        .then((res) => {
          console.log(res);
          setDelivererData(res);
          setFlag(true);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (props.mail)
      getDelivererByEmail();
  }, [props.mail]);


  // useeffect that loads all the avaiable orders in the city of the deliverer

  useEffect(() => {
    const getAllDeliverableOrders = async () => {
      console.log(delivererData);
      await API.getDeliverableOrders(delivererData.city)
        .then((res) => {
          setAvaiableOrders(res);

        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (flag && delivererData) {
      getAllDeliverableOrders();
      console.log(avaiableOrders);
    }

  }, [flag]);

  useEffect(() => {
    const getAllDeliverableOrdersUpdated = async () => {
      await API.getDeliverableOrders(delivererData.city)
        .then((res) => {
          setAvaiableOrders(res);

        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (flag && delivererData && updated) {

      getAllDeliverableOrdersUpdated();
      setUpdated(false);

    }

  }, [flag, updated]);



  console.log(avaiableOrders);


  return (<>
    <br />
    <div>
      <Button variant="light" style={{ 'fontSize': 30, 'borderStyle': 'hidden', 'backgroundColor': "#DCDCDC", 'position': 'absolute', 'right': '30px' }} onClick={props.logout}><Link to="/">LOGOUT</Link></Button></div>




    <Container fluid>
      <span className="d-block text-center mt-5 mb-2 display-2">
        Delivery Personnel Area
      </span>
    </Container>
    <h1 className="mt-3 text-center">{(avaiableOrders.length != 0) ? <>There are {avaiableOrders.length} available order(s) in {delivererData.city}!</> : <>There is no order in your city</>}</h1>
    <h1></h1>
    {/*
          <> userRole: {props.userRole}</>
          <> delivererId: {props.delivererId}</>
          <> mail: {props.mail}</> */}
    <Container className="table-responsive text-center">
      <Table striped bordered hover variant="light" className='table' responsive="lg" size="lg">

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

        {avaiableOrders.map((o) => {
          return (<>
            <tr key={o.id}>
              <td> {o.order_id}</td>
              <td>{o.client_id}</td>

              <td>{o.address}</td>
              <td>{o.zipcode}</td>
              <td>{o.city}</td>
              <td style={{ color: '#4682B4' }}>{o.state}</td>
              <td>
                {
                  <Image src={ris} data-testid="im" style={{ width: '80px', height: '30px', 'cursor': 'pointer' }} onClick={() => {

                    API.updateState(o.order_id, "shipped").then(() => {
                      setTimeout(() => { console.log("Order is shipped") }, 3000)
                    });
                    setUpdated(true);

                  }
                  }></Image>
                }
              </td>
              <td>
                {o.state == "shipped" ?
                  <Image src={ris} data-testid="im" style={{ width: '80px', height: '30px', 'cursor': 'pointer' }} onClick={() => {
                    API.updateState(o.order_id, "delivered").then(() => {
                      setTimeout(() => {  console.log("Order is delivered")}, 3000)
                    });
                    setUpdated(true);
                  }
                  }></Image> : <></>
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
