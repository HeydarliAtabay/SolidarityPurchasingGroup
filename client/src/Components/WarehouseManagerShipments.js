import API from '../API';
import { Button, Modal, Alert, Spinner } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { BoxSeam } from 'react-bootstrap-icons';
import dayjs from 'dayjs';

dayjs.Ls.en.weekStart = 1; //set week to start on monday

function WarehouseManagerShipments(props) {

  const [providers, setProviders] = useState([]);
  const [update, setUpdate] = useState(true);
  const [providerOrders, setProviderOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [receivedAlert, setReceivedAlert] = useState(false);

  const [providerFilterID, setProviderFilterID] = useState(-1);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const getAllProviders = async () => {
      await API.getAllProviders()
        .then((res) => {
          setProviders(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAllProviders();
  }, []);


  useEffect(() => {
    if (!update) {
      return;
    }
    const loadOrders = async () => {
      setLoading(true);
      const prods = await API.getAllProducts();

      setProducts(prods);

      const previousWeek = getPreviousWeek().week_number;
      const previousWeekYear = getPreviousWeek().year;


      let orders = (await API.getAllOrders()).
        filter(o => o.farmer_state === 'farmer-shipped'
          && o.state === 'booked'
          && prods.find((p) => (p.id === o.product_id)).week === previousWeek
          && prods.find((p) => (p.id === o.product_id)).year === previousWeekYear).map(o => ({ ...o, provider_id: prods.find((p) => (p.id === o.product_id)).providerId }));

      /* filter orders if provider selected from dropdown */
      if (providerFilterID !== -1) {
        orders.filter(o => prods.find((p) => (p.id === o.product_id).providerId === providerFilterID));
      }

      setProviderOrders(orders);
      setUpdate(false);
      setLoading(false);
    }

    loadOrders();
  }, [providerFilterID, update]);

  const getPreviousWeek = () => {
    //every time get previous week
    let previousWeekDate = dayjs(props.time.date).subtract(1, 'week');
    return {
      year: dayjs(props.time.date).year(),
      week_number: dayjs(previousWeekDate).week(),
    };
  };


  return (
    <div className="row">
      <span className="d-block text-center mt-5 mb-2 display-1">
        Incoming farmer shipments
      </span>
      <h5 className="d-block mx-auto mb-5 text-center text-muted">
        View farmer shipments and confirm their correct reception
      </h5>

      <div className="col-lg-2"></div>
      <div className="col-lg-8">
        {receivedAlert &&
          <Alert
            variant={receivedAlert.variant}
            className='my-3 mx-2'
            dismissible={true}
            onClose={() => setReceivedAlert(null)}
          >
            {receivedAlert.msg}
          </Alert>
        }

        <div className="row mt-3 mb-5">
          <div className='col-lg-4 text-center'>
            <h4 className='my-auto'>Filter farmer shipments: </h4>
          </div>
          <div className='col-lg-8 text-center'>
            <select className="form-select" value={providerFilterID} onChange={(event) => { setProviderFilterID(parseInt(event.target.value)); setUpdate(true); }}>
              <option value={-1}>All farmers</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))
              }
            </select>
          </div>
        </div>

        <hr />
        {loading &&
          <div className="d-block text-center">
            <Spinner animation="grow" />
          </div>
        }
        {!loading &&
          <FarmerShippedOrderTable
            setUpdate={setUpdate}
            setReceivedAlert={setReceivedAlert}
            setRecharged={props.setRecharged}
            providerFilterID={providerFilterID}
            providerOrd={providerOrders}
            products={products}
            providers={providers} />
        }
      </div>
      <div className="col-lg-2"></div>
    </div>
  );
}

function FarmerShippedOrderTable(props) {

  const [receivedID, setReceivedID] = useState(null);

  console.log(props.providerOrd);

  useEffect(() => {
    if (receivedID === null) {
      return;
    }
    const updateOrderState = async () => {
      try {
        await API.updateStateOnce(receivedID.id, 'received');
        const productName = props.products.find((p) => (p.id === receivedID.product_id)) ? capitalizeEachFirstLetter(props.products.find((p) => (p.id === receivedID.product_id)).name) : "Unkown product";
        props.setReceivedAlert({ msg: productName + " from order #" + receivedID.order_id + " were successfully received.", variant: "success" });
      }
      catch (err) {
        console.log(err);
        props.setReceivedAlert({ msg: "Oops! Something went wrong and the order could not be received.", variant: "danger" });
      }
      setReceivedID(null);
      props.setRecharged(true);
      props.setUpdate(true);
    };

    updateOrderState();
  }, [receivedID]);

  const capitalizeEachFirstLetter = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
  };

  return (
    <div className="d-block px-3 py-4">
      <table className='text-center table table-striped table-hover table-responsive'>
        <thead>
          <tr>
            <th></th>
            <th>Order ID</th>
            <th>Farmer</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {props.providerOrd.map((s) => (
            <tr key={s.order_id + "" + s.product_id}>
              <td>
                <img
                  className="shadow rounded-circle product-buy-size-custom"
                  src={
                    process.env.PUBLIC_URL +
                    'products/' +
                    s.product_id +
                    '.jpg'
                  }
                  alt="Product img"
                />
              </td>
              <td className="align-middle">{s.order_id}</td>
              <td className="align-middle">{props.providers.find((p) => (p.id === s.provider_id)) ? props.providers.find((p) => (p.id === s.provider_id)).name : "Unknown"}</td>
              <td className="align-middle">
                {props.products.find((p) => (p.id === s.product_id)) ? capitalizeEachFirstLetter(props.products.find((p) => (p.id === s.product_id)).name) : "Unkown product"}
              </td>
              <td className="align-middle">
                {s.order_quantity} {props.products.find((p) => (p.id === s.product_id)) ? props.products.find((p) => (p.id === s.product_id)).unit : ""}
              </td>
              <td className="align-middle">
                <Button variant="success" onClick={() => { setReceivedID({ order_id: s.order_id, id: s.id, product_id: s.product_id }); }}>
                  <BoxSeam /> Confirm received
                </Button>
              </td>
            </tr>)
          )}
        </tbody>
      </table>
      {props.providerOrd.length === 0 && props.filteredProviderID === -1 &&
        <div className='d-block text-center'>
          There are no shipments sent to the warehouse
        </div>
      }
      {props.providerOrd.length === 0 && props.filteredProviderID !== -1 &&
        <div className='d-block text-center'>
          There are no shipments sent to the warehouse from this farmer
        </div>
      }
    </div>
  )
}

export default WarehouseManagerShipments;