import { Button, Modal, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import { BoxSeam } from 'react-bootstrap-icons';
import API from '../API'
import { useState, useEffect } from "react";
import dayjs from 'dayjs';

var isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);

dayjs.Ls.en.weekStart = 1; //set week to start on monday

function PickupListEmployee(props) {
  const [show, setShow] = useState(false);
  const [id, setId] = useState();
  const [orders, setOrders] = useState([]);
  const [ordersMap, setOrdersMap] = useState(new Map());
  const [prepare, setPrepare] = useState(false);
  const [prepareID, setPrepareID] = useState(0);
  const [updateOrders, setUpdateOrders] = useState(true);

  /* Create orders array to show in table*/
  useEffect(() => {
    if (!updateOrders) {
      return;
    }
    setUpdateOrders(false);

    const getOrds = async () => {

      const previousWeek = getPreviousWeek().week_number;
      const previousWeekYear = getPreviousWeek().year;

      const condensedOrders = new Map();

      (await API.getAllOrders()).filter(o => o.pickup === 1 && (o.state !== 'prepared' && o.state !== 'shipped' && o.state !== 'delivered' && o.state !== 'pending')
        && props.products.find((p) => (p.id === o.product_id)).week === previousWeek
        && props.products.find((p) => (p.id === o.product_id)).year === previousWeekYear)
        .forEach((order) => {
          if (!condensedOrders.has(order.order_id)) {
            condensedOrders.set(order.order_id, { order_received: true, order_array: new Array() });
          }
          condensedOrders.get(order.order_id).order_array.push(order);
        });

      condensedOrders.forEach((order_obj) => {
        const order_array = order_obj.order_array;
        order_array.forEach((order) => {
          if (order.state !== 'received') {
            order_obj.order_received = false;
          }
        });
      });
      setOrdersMap(condensedOrders);

      const ords = [];
      condensedOrders.forEach((order_obj) => {
        let sum = 0;
        order_obj.order_array.forEach((order) => {
          sum += order.OrderPrice;
        });
        ords.push({ order_id: order_obj.order_array[0].order_id, client_id: order_obj.order_array[0].client_id, sum: sum, date: order_obj.order_array[0].date, time: order_obj.order_array[0].time, order_received: order_obj.order_received })
      });
      setOrders(ords);
    }

    getOrds();

  }, [props.time.date, updateOrders])

  useEffect(() => {
    if (!prepare) {
      return;
    }
    const updateOrderPrepared = async () => {
      try {
        setPrepare(false);
        await API.updateState(prepareID, 'prepared');
        props.setRecharged(true);
        props.setPrepareAlert({ msg: "Order #" + prepareID + " was successfully prepared for pick-up.", variant: "success" });
      }
      catch (err) {
        props.setPrepareAlert({ msg: "Oops! Something went wrong and the order could not be prepared.", variant: "danger" });
      }
      setUpdateOrders(true);
    }
    updateOrderPrepared();
  }, [prepare]);

  const capitalizeEachFirstLetter = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
  };

  const getPreviousWeek = () => {
    //every time get previous week
    let previousWeekDate = dayjs(props.time.date).subtract(1, 'week');
    return {
      year: dayjs(props.time.date).year(),
      week_number: dayjs(previousWeekDate).week(),
    };
  };

  const handleClose = (x) => {
    setShow(x);

  }

  return (
    <>
      <div className="d-block mx-3">
        <table className='text-center table table-striped table-hover table-responsive'>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Client</th>
              <th>Products list</th>
              <th>Total</th>
              <th>Pick-up date</th>
              <th>Action</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((s) => (
              <tr key={s.id}>
                <td className="align-middle">{s.order_id}</td>
                <td className="align-middle">{props.clients.find((c) => (c.client_id === s.client_id)) ? props.clients.find((c) => (c.client_id === s.client_id)).name + " " + props.clients.find((c) => (c.client_id === s.client_id)).surname : "Unknown"}</td>
                <td className="align-middle">
                  <Button variant="link" onClick={() => { setShow(true); setId(s.order_id); }}>
                    Show order products
                  </Button>
                </td>
                <td className="align-middle">{s.sum.toFixed(2)}€</td>
                <td className="align-middle">
                  <span>
                    {dayjs(s.date + " " + s.time).format("ddd, MMM D, YYYY HH:mm")}
                  </span>
                </td>
                <td className="align-middle">
                  <Button variant="success" disabled={!s.order_received} onClick={() => { setPrepare(true); setPrepareID(s.order_id); }}>
                    <BoxSeam /> Confirm preparation
                  </Button>
                </td>
                <td>
                  {!s.order_complete &&
                    <>
                      <OverlayTrigger placement="auto" overlay={
                        <Tooltip>
                          Order cannot be prepared for pick-up since <b>some products have not yet been received by the warehouse</b>.
                        </Tooltip>}>
                        <span>{infoIcon}</span>
                      </OverlayTrigger>

                    </>}
                </td>
              </tr>)
            )}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className='d-block text-center my-3'>
            There are no orders to be prepared for pick-up.
          </div>
        )}
      </div>


      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title >
            Products in order #{id}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <ul className="list-group">
            {ordersMap.has(id) && ordersMap.get(id).order_array.map((s) => (
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
                    {stockIcon} {s.order_quantity} {props.products.find((p) => (p.id === s.product_id)).unit}
                  </div>
                  <div className="col-md-3 mb-2 text-start my-auto">
                    {priceIcon} {s.OrderPrice.toFixed(2)}€
                  </div>
                </div>
                {s.state === 'received' &&
                  <div className="d-block text-center">
                    <small className='text-success'>The product was received by the warehouse</small>
                  </div>
                }
                {s.farmer_state === "farmer-shipped" && s.state !== 'received' &&
                  <div className="d-block text-center">
                    <small className='text-danger'>This product was shipped by the farmer but has not been received yet</small>
                  </div>
                }
                {s.farmer_state !== "farmer-shipped" && s.state === 'booked' &&
                  <div className="d-block text-center">
                    <small className='text-danger'>This product has not yet been shipped by the farmer</small>
                  </div>
                }
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => (setShow(false))}>Close product list</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

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

const infoIcon = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
</svg>





export default PickupListEmployee;