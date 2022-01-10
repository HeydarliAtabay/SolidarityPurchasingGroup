import { Button, Modal, OverlayTrigger, Badge, Tooltip } from 'react-bootstrap';
import { BoxSeam } from 'react-bootstrap-icons';
import API from '../API'
import { useState, useEffect } from "react";
import dayjs from 'dayjs';

var isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);

dayjs.Ls.en.weekStart = 1; //set week to start on monday

function PickupListManager(props) {
  const [show, setShow] = useState(false);
  const [id, setId] = useState();
  const [orders, setOrders] = useState([]);
  const [ordersMap, setOrdersMap] = useState(new Map());
  const [prepare, setPrepare] = useState(false);
  const [prepareID, setPrepareID] = useState(0);
  const [updateOrders, setUpdateOrders] = useState(true);

  const [showOrderStatus, setShowOrderStatus] = useState(false);

  /* Create orders array to show in table*/
  useEffect(() => {
    if (!updateOrders) {
      return;
    }

    const getOrders = async () => {

      setUpdateOrders(false);

      const previousWeek = getPreviousWeek().week_number;
      const previousWeekYear = getPreviousWeek().year;

      const condensedOrders = new Map();


      (await API.getAllOrders()).filter(o => o.pickup === 1
        && props.products.find((p) => (p.id === o.product_id)).week === previousWeek
        && props.products.find((p) => (p.id === o.product_id)).year === previousWeekYear)
        .forEach((order) => {
          if (!condensedOrders.has(order.order_id)) {
            condensedOrders.set(order.order_id, { order_prepared: false, order_delivered: false, order_array: new Array() });
          }
          condensedOrders.get(order.order_id).order_array.push(order);
        });

      condensedOrders.forEach((order_obj) => {
        const order_array = order_obj.order_array;
        order_array.forEach((order) => {
          if (order.state === 'prepared') {
            order_obj.order_prepared = true;
          }
          if (order.farmer_state === 'delivered') {
            order_obj.order_delivered = true;
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
        console.log(order_obj);
        ords.push({
          order_id: order_obj.order_array[0].order_id,
          client_id: order_obj.order_array[0].client_id,
          sum: sum,
          date: order_obj.order_array[0].date,
          time: order_obj.order_array[0].time,
          order_delivered: order_obj.order_delivered,
          order_prepared: order_obj.order_prepared
        })
      });
      setOrders(ords);
    }

    getOrders();
  }, [props.time.date, props.orders.length])

  const getPreviousWeek = () => {
    //every time get previous week
    let previousWeekDate = dayjs(props.time.date).subtract(1, 'week');
    return {
      year: dayjs(props.time.date).year(),
      week_number: dayjs(previousWeekDate).week(),
    };
  };

  const capitalizeEachFirstLetter = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
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
              <th>Order state</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((s) => (
              <tr key={s.order_id}>
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
                  {s.order_delivered && <span className="text-success fw-bold">Order delivered & completed</span>}
                  {!s.order_delivered && s.order_prepared && <span className="text-success fw-bold">Ready for pick-up</span>}
                  {!s.order_delivered && !s.order_prepared && <span className="text-danger fw-bold">Not ready for pick-up</span>}
                </td>
                <td>
                  <Button variant="success" className="d-block my-1 mx-2 w-100" onClick={() => { setShowOrderStatus(true); setId(s.order_id); }}>
                    Track order status
                  </Button>
                </td>
              </tr>)
            )}
          </tbody>
        </table>
      </div>

      <OrderStatus show={showOrderStatus} setShow={setShowOrderStatus} id={id} orders={props.orders} products={props.products} />

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

function OrderStatus(props) {

  const [status, setStatus] = useState(null);

  useEffect(() => {
    let min = 1000;
    let orderStatus = null;

    props.orders.filter((o) => (o.order_id === props.id)).forEach((item) => {

      const type = item.pickup === 0 ? 'delivery' : 'pick-up';
      let orderStatusLocal = null;

      if (item.state === 'missed') {
        orderStatusLocal = getOrderStatus('missed', type);
      }
      else if (item.state === 'pending') {
        orderStatusLocal = getOrderStatus('pending', type);
      }
      else if (item.state === 'booked' && item.farmer_state === null) {
        orderStatusLocal = getOrderStatus('booked', type);
      }
      else if (item.state === 'booked' && item.farmer_state === 'confirmed') {
        orderStatusLocal = getOrderStatus('booked', type);
      }
      else if (item.state === 'booked' && item.farmer_state === 'farmer-shipped') {
        orderStatusLocal = getOrderStatus('farmer-shipped', type);
      }
      else if (item.state === 'received') {
        orderStatusLocal = getOrderStatus('received', type);
      }
      else if (item.state === 'prepared') {
        orderStatusLocal = getOrderStatus('prepared', type);
      }
      else if (item.state === 'shipped') {
        orderStatusLocal = getOrderStatus('shipped', type);
      }
      else if (item.state === 'delivered') {
        orderStatusLocal = getOrderStatus('delivered', type);
      }

      if (orderStatusLocal.num_steps < min) {
        orderStatus = orderStatusLocal;
        min = orderStatusLocal.num_steps;
      }
    });

    setStatus(orderStatus);
  }, [props.id]);

  const getOrderStatus = (status, type) => {
    const orderStatus = {
      order_completed: false,
      order_steps: 0,
      delivery_type: '',
      client: { payed: false, missed: false }, farmer: { shipped: false },
      warehouse: { received: false, prepared: false },
      delivery: { picked_up: false, shipped: false, delivered: false }
    };

    orderStatus.delivery_type = type;

    if (status === 'missed') {
      orderStatus.client.missed = true;
      orderStatus.num_steps = -1;
    }
    else if (status === 'pending') {
      orderStatus.client.payed = false;
      orderStatus.num_steps = 0;
    }
    else if (status === 'booked') {
      orderStatus.client.payed = true;
      orderStatus.num_steps = 1;
    }
    else if (status === 'farmer-shipped') {
      orderStatus.client.payed = true;
      orderStatus.farmer.shipped = true;
      orderStatus.num_steps = 2;
    }
    else if (status === 'received') {
      orderStatus.client.payed = true;
      orderStatus.farmer.shipped = true;
      orderStatus.warehouse.received = true;
      orderStatus.num_steps = 3;
    }
    else if (status === 'prepared') {
      orderStatus.client.payed = true;
      orderStatus.farmer.shipped = true;
      orderStatus.warehouse.received = true;
      orderStatus.warehouse.prepared = true;
      orderStatus.num_steps = 4;
    }
    else if (type === 'pick-up') {
      if (status === 'delivered') {
        orderStatus.client.payed = true;
        orderStatus.farmer.shipped = true;
        orderStatus.warehouse.received = true;
        orderStatus.warehouse.prepared = true;
        orderStatus.delivery.delivered = true;
        orderStatus.order_completed = true;
        orderStatus.num_steps = 5;
      }
    }
    else if (type === 'delivery') {
      if (status === 'shipped') {
        orderStatus.client.payed = true;
        orderStatus.farmer.shipped = true;
        orderStatus.warehouse.received = true;
        orderStatus.warehouse.prepared = true;
        orderStatus.delivery.shipped = true;
        orderStatus.num_steps = 5;
      }
      else if (status === 'delivered') {
        orderStatus.client.payed = true;
        orderStatus.farmer.shipped = true;
        orderStatus.warehouse.received = true;
        orderStatus.warehouse.prepared = true;
        orderStatus.delivery.shipped = true;
        orderStatus.delivery.delivered = true;
        orderStatus.order_completed = true;
        orderStatus.num_steps = 6;
      }
    }
    else {
      console.error("INVALID ORDER STATUS " + status + " " + type);
    }

    return orderStatus;
  }


  return (
    <Modal show={props.show} onHide={() => (props.setShow(false))} size="lg">
      <Modal.Header closeButton>
        <Modal.Title >

        </Modal.Title>
      </Modal.Header>

      {status &&
        <Modal.Body>
          <div className="row">
            <div className="col-lg-6 display-6">Order history {props.id}</div>
            <div className="col-lg-6">
              <h5 className='d-block mt-2 mb-0 me-2 text-end'>
                <Badge bg={status.order_completed ? "success" : "danger"}>{status.order_completed ? "Order completed" : "Order not yet completed"}</Badge>
              </h5>
            </div>
          </div>
          {!status.client.missed && <>
            <div className='row'>
              <span className='d-block lead mt-2'><span className='text-success'>{verticalIcon}</span> Client</span>
              <div className="d-block text-success fw-bold">{completedIcon} Order placed</div>
              {status.client.payed && <span className='d-block text-success'>{verticalIcon}</span>}
              {!status.client.payed && <span className='d-block text-secondary'>{verticalIcon}</span>}
              {status.client.payed && <div className="d-block text-success fw-bold">{completedIcon} Payment completed</div>}
              {!status.client.payed && <div className="d-block text-danger fw-bold">{errorIcon} Payment pending</div>}
            </div>
            <div className='row'>
              {status.client.payed && status.farmer.shipped && <span className='d-block lead mt-2'><span className='text-success'>{verticalIcon}</span> Farmer</span>}
              {(!status.client.payed || !status.farmer.shipped) && <span className='d-block lead mt-2'><span className='text-secondary'>{verticalIcon}</span> Farmer</span>}
              {status.farmer.shipped && <div className="d-block text-success fw-bold">{completedIcon} All farmers have shipped the products</div>}
              {!status.farmer.shipped && <div className="d-block text-secondary">{incompletedIcon} All farmers have shipped the products</div>}
            </div>
            <div className='row'>
              {status.farmer.shipped && status.warehouse.received && <span className='d-block lead mt-2'><span className='text-success'>{verticalIcon}</span> Warehouse</span>}
              {(!status.farmer.shipped || !status.warehouse.received) && <span className='d-block lead mt-2'><span className='text-secondary'>{verticalIcon}</span> Warehouse</span>}

              {status.warehouse.received && <div className="d-block text-success fw-bold">{completedIcon} Farmer shipment has been received by the warehouse</div>}
              {!status.warehouse.received && <div className="d-block text-secondary">{incompletedIcon} Farmer shipment has been received by the warehouse</div>}

              {status.warehouse.received && status.warehouse.prepared && <span className='d-block text-success'>{verticalIcon}</span>}
              {(!status.warehouse.received || !status.warehouse.prepared) && <span className='d-block text-secondary'>{verticalIcon}</span>}

              {status.warehouse.prepared && <div className="d-block text-success fw-bold">{completedIcon} Order has been prepared by the warehouse</div>}
              {!status.warehouse.prepared && <div className="d-block text-secondary">{incompletedIcon} Order has been prepared by the warehouse</div>}
            </div>
            <div className='row'>
              {status.warehouse.prepared && status.delivery_type === 'pick-up' && status.delivery.delivered && <span className='d-block lead mt-2'><span className='text-success'>{verticalIcon}</span> Delivery</span>}
              {status.delivery_type === 'pick-up' && (!status.warehouse.prepared || !status.delivery.delivered) && <span className='d-block lead mt-2'><span className='text-secondary'>{verticalIcon}</span> Delivery</span>}

              {status.delivery_type === 'pick-up' && status.delivery.delivered && <div className="d-block text-success fw-bold">{completedIcon} Client has picked up the order</div>}
              {status.delivery_type === 'pick-up' && !status.delivery.delivered && <div className="d-block text-secondary">{incompletedIcon} Client has picked up the order</div>}


              {status.warehouse.prepared && status.delivery_type === 'delivery' && status.delivery.shipped && <span className='d-block lead mt-2'><span className='text-success'>{verticalIcon}</span> Delivery</span>}
              {(status.delivery_type === 'delivery' && (!status.warehouse.prepared || !status.delivery.shipped)) && <span className='d-block lead mt-2'><span className='text-secondary'>{verticalIcon}</span> Delivery</span>}

              {status.delivery_type === 'delivery' && status.delivery.shipped && <div className="d-block text-success fw-bold">{completedIcon} Order has been shipped</div>}
              {status.delivery_type === 'delivery' && !status.delivery.shipped && <div className="d-block text-secondary">{incompletedIcon} Order has been shipped</div>}

              {status.delivery_type === 'delivery' && status.delivery.shipped && status.delivery.delivered && <span className='d-block text-success'>{verticalIcon}</span>}
              {status.delivery_type === 'delivery' && (!status.delivery.shipped || !status.delivery.delivered) && <span className='d-block text-secondary'>{verticalIcon}</span>}

              {status.delivery_type === 'delivery' && status.delivery.delivered && <div className="d-block text-success fw-bold">{completedIcon} Order successfully delivered</div>}
              {status.delivery_type === 'delivery' && !status.delivery.delivered && <div className="d-block text-secondary">{incompletedIcon} Order successfully delivered</div>}
            </div>
          </>}
          {status.client.missed && (
            <div className='row'>
              <div className='d-block lead fw-bold text-center text-danger mt-5 mb-2'>
                {dangerIcon} You have missed this order!
              </div>
              <div className='d-block text-center text-danger mb-3'>
                Please note that 5 missed orders will have your account disabled.
              </div>
            </div>
          )}
        </Modal.Body>
      }
      <Modal.Footer>
        <Button onClick={() => (props.setShow(false))}>Close order history</Button>
      </Modal.Footer>
    </Modal >
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

const incompletedIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
</svg>

const completedIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
  <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
</svg>

const errorIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
</svg>

const verticalIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
</svg>

const dangerIcon = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-exclamation-triangle" viewBox="0 0 16 16">
  <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
  <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
</svg>




export default PickupListManager;