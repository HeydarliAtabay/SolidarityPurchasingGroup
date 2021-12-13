import dayjs from 'dayjs';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../API';
const { useState, useEffect } = require('react');

dayjs.Ls.en.weekStart = 1; //set week to start on monday

function FarmerOrderPreparation(props) {
  /*products arrays*/
  const [bookedProducts, setBookedProducts] = useState([]);

  /*ship status alert*/
  const [itemsAlreadyShipped, setItemsAlreadyShipped] = useState(false);
  const [shipmentWindowValidity, setShipmentWindowValidity] = useState(true);
  const [refreshData, setRefreshData] = useState(true);
  const [shipError, setShipError] = useState('');

  /*spinning circle*/
  const [showLoading, setShowLoading] = useState(true);

  /*useEffect triggers*/
  const [confirmShipment, setConfirmShipment] = useState(false);

  /*USEFFECTS*/
  /*Get items that need to be shipped*/
  useEffect(() => {
    if (!refreshData) {
      return;
    }
    const getBookedOrders = async () => {
      setShowLoading(true);

      const previousWeek = getPreviousWeek();

      const timeWindowValid = checkShipmentTimeWindow();
      if (!timeWindowValid) {
        setShipmentWindowValidity(false);
      } else {
        setShipmentWindowValidity(true);
      }

      console.log(timeWindowValid);

      const checkItemsAlreadyShipped = await API.getProviderShipmentStatus(
        previousWeek.year,
        previousWeek.week_number
      );
      console.log(checkItemsAlreadyShipped);
      if (checkItemsAlreadyShipped) {
        setItemsAlreadyShipped(true);
        setRefreshData(false);
        setShowLoading(false);
        return;
      }
      const prods = (
        await API.getOrderedProductsForProvider(
          previousWeek.year,
          previousWeek.week_number
        )
      ).map((p) => ({ ...p, prepared: 0 }));
      setBookedProducts(prods);
      setRefreshData(false);
      setShowLoading(false);
    };
    getBookedOrders();
  }, [refreshData, props.time.date, props.time.hour]);

  /*Set order status as farmer-shipped*/
  useEffect(() => {
    if (!confirmShipment) {
      return;
    }
    const shipItems = async () => {
      const shippedIDs = bookedProducts.map((p) => p.id);
      await API.setProductsAsFarmerShipped(shippedIDs);
      setRefreshData(true);
    };
    shipItems();
  }, [confirmShipment]);

  /*Utility functions*/
  const getPreviousWeek = () => {
    //Sunday from 23.00 until 23.59 consider this week orders
    if (dayjs(props.time.date).day() === 0) {
      if (dayjs('01/01/2021 ' + props.time.hour).hour() === 23) {
        //this week orders
        const thisWeekDate = dayjs(props.time.date);
        return {
          year: dayjs(thisWeekDate).year(),
          week_number: dayjs(thisWeekDate).week(),
        };
      }
    }
    //every other time get previos week
    let previousWeekDate = dayjs(props.time.date).subtract(1, 'week');
    if (dayjs(props.time.date).week() === 2) {
      return {
        year: dayjs(props.time.date).year(),
        week_number: dayjs(previousWeekDate).week(),
      };
    }
    return {
      year: dayjs(previousWeekDate).year(),
      week_number: dayjs(previousWeekDate).week(),
    };
  };

  const checkShipmentTimeWindow = () => {
    const dayOfWeek = dayjs(props.time.date).day();
    //if not sunday,monday or tuesday window is expired
    if (dayOfWeek !== 0 && dayOfWeek !== 1 && dayOfWeek !== 2) {
      return false;
    }
    //sunday only from 23.00 onwards
    if (dayOfWeek === 0 && dayjs('01/01/2021 ' + props.time.hour).hour() < 23) {
      return false;
    }
    return true;
  };

  const checkShipmentCorrectness = () => {
    for (const prod of bookedProducts) {
      if (prod.prepared === 0) {
        setShipError(
          'Please confirm all the products and then confirm the shipment.'
        );
        return;
      }
    }
    setShipError('');
    setConfirmShipment(true);
  };

  const capitalizeEachFirstLetter = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
  };

  return (
    <>
      <div className="w-100">
        <span className="d-block text-center mt-5 mb-2 display-2">
          Order preparation
        </span>
        <h5 className="d-block mx-auto mb-5 text-center text-muted">
          Select the items which you have prepared for shipping.
          <br />
          After selecting all the items you can ship the order.
        </h5>
        <div className="container">
          <div className="row">
            <div className="col-lg-2" />
            <div className="col-lg-8">
              {!showLoading && !shipmentWindowValidity && !itemsAlreadyShipped && (
                <Alert show={true} variant="danger">
                  <Alert.Heading>Item shipment missed</Alert.Heading>
                  <p>
                    It seems that you have missed the orders shipment time window!
                    <br />
                    Contact the shop as soon as possible to get more information.
                    <br />
                    Next shipping window is from Sunday 23.00 until Tuesday 23.59.
                  </p>
                  <hr />
                  <div className="d-flex justify-content-end">
                    <Link to="/farmer">
                      <Button variant="outline-danger">Back to Farmer Area</Button>
                    </Link>
                  </div>
                </Alert>
              )}
              {!showLoading && itemsAlreadyShipped && (
                <Alert show={itemsAlreadyShipped} variant="success">
                  <Alert.Heading>Item shipment status</Alert.Heading>
                  <p>
                    You have successfully shipped your items!
                    <br />
                    Next shipping window is from Sunday 23.00 until Tuesday 23.59.
                  </p>
                  <hr />
                  <div className="d-flex justify-content-end">
                    <Link to="/farmer">
                      <Button variant="outline-success">Back to Farmer Area</Button>
                    </Link>
                  </div>
                </Alert>
              )}
              {showLoading && (
                <div className="d-block text-center p-5">
                  <Spinner className="m-5" animation="grow" />
                </div>
              )}
              {!itemsAlreadyShipped && shipmentWindowValidity && !showLoading && (
                <div className="d-block text-center">
                  {
                    /*DISPLAYING NOTIFICATION IF NO PRODUCTS INSERTED YET*/
                    bookedProducts.length === 0 ? (
                      <div className="d-block text-center">No orders received.</div>
                    ) : (
                      ''
                    )
                  }
                  {/*DISPLAYING CURRENTLY INSERTED PRODUCTS*/}
                  <ul className="list-group list-group-flush mx-auto">
                    {bookedProducts.map((product) => {
                      return (
                        <li key={product.id} className="list-group-item">
                          <div className="row w-100">
                            <div className="col-md-1 mb-2 my-auto">
                              <img
                                className="w-100 shadow rounded-circle"
                                src={
                                  process.env.PUBLIC_URL +
                                  'products/' +
                                  product.id +
                                  '.jpg'
                                }
                                alt="Product img"
                              />
                            </div>
                            <div className="col-md-5 mb-2 text-start my-auto">
                              <h4>{capitalizeEachFirstLetter(product.name)}</h4>
                            </div>
                            <div className="col-md-3 mb-2 text-start my-auto">
                              {stockIcon} {product.tot_quantity + ' ' + product.unit}
                            </div>
                            <div className="col-md-3 mb-2 text-center my-auto">
                              {product.prepared === 0 && (
                                <button
                                  className="btn btn-success shadow"
                                  onClick={() =>
                                    setBookedProducts((prods) => {
                                      const newProds = [];
                                      for (const prod of prods) {
                                        if (prod.id === product.id) {
                                          prod.prepared = 1;
                                        }
                                        newProds.push(prod);
                                      }
                                      return newProds;
                                    })
                                  }
                                >
                                  Confirm prepared
                                </button>
                              )}
                              {product.prepared === 1 && (
                                <span className="d-block text-center text-success">
                                  {checkIcon} Prepared
                                </span>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
            <div className="col-lg-2" />
          </div>
        </div>
        <hr />
        <div className="d-block mb-5 text-center">
          <small className="text-danger">{shipError}</small>
        </div>
        <div className="d-block mb-5 text-center">
          <button
            className="mx-2 p-3 btn btn-primary"
            onClick={() => checkShipmentCorrectness()}
          >
            Confirm items shipment
          </button>
        </div>
      </div>
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

const checkIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-check2"
    viewBox="0 0 16 16"
  >
    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
  </svg>
);

export default FarmerOrderPreparation;
