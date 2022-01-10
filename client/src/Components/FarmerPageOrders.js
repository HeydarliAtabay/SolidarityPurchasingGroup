import { Button, Modal, Spinner } from 'react-bootstrap';
import { useState } from "react";
import API from "../API";

import dayjs from 'dayjs';
import { useEffect } from 'react';

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function Fbookings(props) {

  const [show, setShow] = useState(false);
  const [id, setId] = useState();
  const [orders, setOrders] = useState([]);

  /* Create orders array to show in table*/
  useEffect(() => {
    let data = dayjs(props.time.date);

    let array1 = props.products.filter(x => x.providerId === props.providerid).map(x => x.id);

    let filteredOrders = props.orders.filter(x => array1.includes(x.product_id));
    let m = filteredOrders.filter(x => x.state !== "missed").map(s => s.order_id).filter(onlyUnique);
    m.reverse();

    let ords = [];
    props.orders.forEach(o => {
      if (m.find(x => (parseInt(x) === parseInt(o.order_id)))) {
        let id1 = m[m.length - 1];
        let array = props.orders.filter(x => x.order_id === id1).map(x => x.OrderPrice);
        let sum = 0;
        for (const a of array) { sum = sum + a; }

        sum = sum.toFixed(2);
        m.pop();

        ords.push({ ...o, sum: sum });
      }
    });
    setOrders(ords.sort((a, b) => (b.order_id - a.order_id)));
  }, [props.time.date])

  const handleClose = (x) => setShow(x);

  const capitalizeEachFirstLetter = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
  };

  return (
    <>
      <div className='row'>

        <span className="d-block text-center mt-5 mb-2 display-1">
          Bookings
        </span>
        <h5 className="d-block mx-auto mb-5 text-center text-muted">
          Choose a date clicking on the clock up above to see only the orders of that day containing the products i can provide as a farmer
        </h5>

        <div className="col-lg-2"></div>
        <div className="col-lg-8">
          <table className="mx-3 text-center table table-striped table-hover table-responsive">
            <thead >
              <tr>
                <th>Order ID</th>
                <th>Client</th>
                <th>Total</th>
                <th>Purchase Type</th>
                <th>Date & Time</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((s) => (
                <tr key={s.id}>
                  <td className="align-middle">{s.order_id}</td>
                  <td className="align-middle">{props.clients.find((c) => (c.client_id === s.client_id)) ? props.clients.find((c) => (c.client_id === s.client_id)).name + " " + props.clients.find((c) => (c.client_id === s.client_id)).surname : "Unknown"}</td>
                  <td className="align-middle">{s.sum}€</td>
                  <td className="align-middle">{s.pickup === 0 ? "Delivery" : "Pick up"}</td>
                  <td className="align-middle">{dayjs(s.date + " " + s.time).format("ddd, MMM D, YYYY HH:mm")}</td>
                  <td className="align-middle">
                    <Button className="btn btn-primary" onClick={() => { setShow(true); setId(s.order_id); }}>
                      Show ordered products
                    </Button>
                  </td>
                </tr>)
              )}
            </tbody>
          </table>

          {orders.length === 0 && <div className='d-block my-3 text-center'>You have not yet received any orders for this day.</div>}

        </div>
        <div className="col-lg-2"></div>
      </div>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title >
            Products in order #{id}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <ul className="list-group">
            {props.orders.filter(x => (x.state === "booked") && (x.order_id === id)).map((s) => {
              if (!props.products.filter(x => x.providerId === props.providerid).map(x => x.id).find(x => x === s.product_id)) {
                return <li key={s.product_id} style={{ display: "none" }}></li>
              }
              else {
                return <>
                  <li key={s.product_id} className="list-group-item">
                    <div className="row">
                      <div className="col-md-1 mb-2 my-auto">
                        <img
                          className="w-100 shadow rounded-circle"
                          src={
                            process.env.PUBLIC_URL +
                            'products/' +
                            s.product_id +
                            '.jpg'
                          }
                          alt="Product img"
                        />
                      </div>
                      <div className="col-md-5 mb-2 text-start my-auto">
                        <h4>{capitalizeEachFirstLetter(s.product_name)}</h4>
                      </div>
                      <div className="col-md-3 mb-2 text-start my-auto">
                        {stockIcon} {s.order_quantity + " " + s.product_unit}
                      </div>
                      <div className="col-md-3 mb-2 text-start my-auto">
                        {priceIcon} {s.OrderPrice.toFixed(2)}€
                      </div>
                    </div>
                  </li></>
              }
            }
            )
            }
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => (setShow(false))}>Close product list</Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}
export default Fbookings;

const stockIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-boxes"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434L7.752.066ZM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567L4.25 7.504ZM7.5 9.933l-2.75 1.571v3.134l2.75-1.571V9.933Zm1 3.134 2.75 1.571v-3.134L8.5 9.933v3.134Zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567-2.742 1.567Zm2.242-2.433V3.504L8.5 5.076V8.21l2.75-1.572ZM7.5 8.21V5.076L4.75 3.504v3.134L7.5 8.21ZM5.258 2.643 8 4.21l2.742-1.567L8 1.076 5.258 2.643ZM15 9.933l-2.75 1.571v3.134L15 13.067V9.933ZM3.75 14.638v-3.134L1 9.933v3.134l2.75 1.571Z"
    />
  </svg>
);

const priceIcon = (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-tag" viewBox="0 0 16 16">
  <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z" />
  <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z" />
</svg>)











