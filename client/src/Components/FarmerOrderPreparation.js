import dayjs from 'dayjs';
import { Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import API from '../API';
const { useState, useEffect } = require('react');

dayjs.Ls.en.weekStart = 1; //set week to start on monday

function FarmerOrderPreparation(props) {
  /*products arrays*/
  const [bookedProducts, setBookedProducts] = useState([]);

  /*ship status alert*/
  //const [itemsAlreadyShipped, setItemsAlreadyShipped] = useState(false);
  //const [shipmentWindowValidity, setShipmentWindowValidity] = useState(true);
  const [refreshData, setRefreshData] = useState(true);
  const [shipError, setShipError] = useState('');
  const history = useHistory();
  /*items shipped alert*/
  const [itemsShippedAlert, setItemsShippedAlert] = useState(null);

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

      const previousWeek = getPreviousWeek().week_number;
      const previousWeekYear = getPreviousWeek().year;

      let orders = props.orders.filter(
        (o) =>
          o.state === 'booked' &&
          o.farmer_state === 'confirmed' &&
          props.products.find((p) => p.id === o.product_id).week ===
            previousWeek &&
          props.products.find((p) => p.id === o.product_id).year ===
            previousWeekYear
      );
      let orders_collapsed = [];
      for (const o of orders) {
        if (
          orders_collapsed.find((order) => order.product_id === o.product_id)
        ) {
          orders_collapsed.find(
            (order) => order.product_id === o.product_id
          ).order_quantity += o.order_quantity;
          orders_collapsed.find(
            (order) => order.product_id === o.product_id
          ).orderPrice += o.orderPrice;
        } else {
          orders_collapsed.push(o);
        }
      }

      let orders_collapsed_formatted = [];
      for (let o of orders_collapsed) {
        if (props.products.find((p) => p.id === o.product_id)) {
          const prod = props.products.find((p) => p.id === o.product_id);
          console.log(prod);
          orders_collapsed_formatted.push({
            id: prod.id,
            name: prod.name,
            tot_quantity: o.order_quantity,
            unit: prod.unit,
            prepared: 0,
          });
        }
      }

      console.log(orders_collapsed_formatted);

      setBookedProducts(orders_collapsed_formatted);
      setRefreshData(false);
      setShowLoading(false);
    };
    getBookedOrders();
  }, [refreshData, props.time.date, props.time.hour, props.orders]);

  /*Set order status as farmer-shipped*/
  useEffect(() => {
    if (!confirmShipment) {
      return;
    }
    const shipItems = async () => {
      try {
        const shippedIDs = bookedProducts
          .filter((p) => p.prepared === 1)
          .map((p) => p.id);
        await API.setProductsAsFarmerShipped(shippedIDs);
        setBookedProducts((prods) => prods.filter((p) => p.prepared === 0));
        setItemsShippedAlert({
          variant: 'success',
          msg: 'All the selected items were marked as prepared and shipped to the warehouse',
        });
        props.setRecharged(true);
        setConfirmShipment(false);
      } catch (error) {
        setItemsShippedAlert({
          variant: 'danger',
          msg: 'Oops! The items could not be prepared. Please try again.',
        });
      }
    };
    shipItems();
  }, [confirmShipment]);

  /*Utility functions*/
  const getPreviousWeek = () => {
    //every time get previous week
    let previousWeekDate = dayjs(props.time.date).subtract(1, 'week');
    return {
      year: dayjs(props.time.date).year(),
      week_number: dayjs(previousWeekDate).week(),
    };
  };

  const checkShipmentCorrectness = () => {
    let noOrderPreparedFlag = true;
    for (const prod of bookedProducts) {
      if (prod.prepared === 1) {
        noOrderPreparedFlag = false;
        break;
      }
    }
    if (noOrderPreparedFlag) {
      setShipError(
        'Please confirm the preparation at least 1 product and then confirm the shipment.'
      );
      return;
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
  const prepareProductsAvailable = () => {
    //Sunday
    if (dayjs(props.time.date).day() === 1) {
      if (dayjs('01/01/2021 ' + props.time.hour).hour() >= 9) {
        //After MON 9AM -> available
        return true;
      } else {
        return false;
      }
    }
    //Monday
    else if (dayjs(props.time.date).day() === 2) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <div className="w-100">
        <span className="d-block text-center mt-5 mb-2 display-2">
          Order preparation
        </span>
        <h5 className="d-block mx-auto mb-5 text-center text-muted">
          Select the items which the client has ordered & payed that you have
          prepared for shipping to the SPG warehouse.
          <br />
          Any additional order that was left pending and that will be payed by
          the client during this Shipping Window will be shown here.
        </h5>
        <div className="container">
          <div className="row">
            <div className="col-lg-2" />
            <div className="col-lg-8">
              {itemsShippedAlert && (
                <Alert
                  variant={itemsShippedAlert.variant}
                  className="text-center my-3 mx-5"
                  dismissible={true}
                  onClose={() => setItemsShippedAlert(null)}
                >
                  {itemsShippedAlert.msg}
                </Alert>
              )}
              {showLoading && (
                <div className="d-block text-center p-5">
                  <Spinner className="m-5" animation="grow" />
                </div>
              )}
              {
                /*shipmentWindowValidity &&*/ !showLoading && (
                  <div className="d-block text-center">
                    {
                      /*DISPLAYING NOTIFICATION IF NO PRODUCTS ORDERED YET*/
                      bookedProducts.length === 0 && (
                        /*!itemsAlreadyShipped &&*/ <div className="d-block text-center">
                          No orders received yet.
                        </div>
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
                                <h4>
                                  {capitalizeEachFirstLetter(product.name)}
                                </h4>
                              </div>
                              <div className="col-md-3 mb-2 text-start my-auto">
                                {stockIcon}{' '}
                                {product.tot_quantity + ' ' + product.unit}
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
                                    Confirm prepared & shipped
                                  </button>
                                )}
                                {product.prepared === 1 && (
                                  <span className="d-block text-center text-success">
                                    {checkIcon} Marked as prepared
                                  </span>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )
              }
            </div>
            <div className="col-lg-2" />
          </div>
        </div>
        <hr />
        <div className="d-block mb-5 text-center">
          <small className="text-danger">{shipError}</small>
        </div>
        <div className="d-block mb-5 text-center">
          <Button
            variant="primary"
            className="mx-2 p-3"
            disabled={bookedProducts.length === 0}
            onClick={() => checkShipmentCorrectness()}
          >
            Confirm items shipment
          </Button>
        </div>
      </div>
      {!prepareProductsAvailable() && (
        <Modal
          show={true}
          dismissible={false}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body>
            The preparing windows is available from:{' '}
            <b>Monday 09 AM until Tuesday evening </b>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                history.push('/farmer');
              }}
            >
              Understood
            </Button>
          </Modal.Footer>
        </Modal>
      )}
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
