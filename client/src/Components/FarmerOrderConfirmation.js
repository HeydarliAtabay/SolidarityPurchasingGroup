import { Button, Spinner, Alert, Modal } from 'react-bootstrap';
import dayjs from 'dayjs';
import { useHistory, Link } from 'react-router-dom';
import API from '../API';

dayjs.Ls.en.weekStart = 1; //set week start as monday

const { useState, useEffect } = require('react');

function FarmerOrderConfirmation(props) {
  /*products arrays*/
  const [bookedProducts, setBookedProducts] = useState([]);
  const [confirmedProduct, setConfirmedProduct] = useState(-1);
  const [unavailableProduct, setUnavailableProduct] = useState(-1);

  const [actionAlert, setActionAlert] = useState(null);
  const history = useHistory();

  /*ship status alert*/
  const [refreshData, setRefreshData] = useState(true);

  /*spinning circle*/
  const [showLoading, setShowLoading] = useState(true);

  /*USEFFECTS*/
  /*Get items that need to be shipped*/
  useEffect(() => {
    if (!refreshData) {
      return;
    }
    const getBookedOrders = async () => {
      setShowLoading(true);

      const week = dayjs(props.time.date).subtract(1, 'week').week();
      const year = dayjs(props.time.date).subtract(1, 'week').year();

      const prods = await API.getProviderAvailableProducts(year, week);
      setBookedProducts(prods);
      setRefreshData(false);
      setShowLoading(false);
    };
    getBookedOrders();
  }, [refreshData, props.time]);

  useEffect(() => {
    if (confirmedProduct === -1) {
      return;
    }

    const shipItems = async () => {
      try {
        setShowLoading(true);
        await API.confirmExpectedProducts(confirmedProduct);
        setRefreshData(true);
        setConfirmedProduct(-1);
        setActionAlert({
          variant: 'success',
          msg: 'Product availability successfully confirmed',
        });
      } catch (error) {
        setActionAlert({
          variant: 'danger',
          msg: 'Oops! Could not confirm product availability. Please try again',
        });
      }
    };
    shipItems();
  }, [confirmedProduct]);

  useEffect(() => {
    if (unavailableProduct === -1) {
      return;
    }

    const removeItems = async () => {
      try {
        setShowLoading(true);
        for (const o of props.orders.filter(
          (o) => o.product_id === unavailableProduct
        )) {
          let client = props.clients.find((c) => c.client_id === o.client_id);
          let product = props.products.find((p) => p.id === unavailableProduct);
          let mailObj = {
            email: client.email,
            message: '',
          };
          /* order payed */
          if (o.state === 'booked') {
            await API.increaseBalance(o.OrderPrice.toFixed(2), o.client_id);
            mailObj.message =
              'Dear ' +
              client.name +
              ' ' +
              client.surname +
              ',\nUnfortunately due to unforeseen circumstances the item "' +
              product.name +
              '" was marked as unavailable from the farmer.\nThe item was removed from your order and the balance was refunded to your wallet.\nKind regards\nSPG';
          } else {
            /* order pending */
            mailObj.message =
              'Dear ' +
              client.name +
              ' ' +
              client.surname +
              ',\nUnfortunately due to unforeseen circumstances the item "' +
              product.name +
              '" was marked as unavailable from the farmer.\nThe item was removed from your order.\nKind regards\nSPG';
          }
          await API.submitEmail(mailObj);
        }
        await API.setUnavailableProducts(unavailableProduct);
        setRefreshData(true);
        setActionAlert({
          variant: 'success',
          msg: 'Product was marked as unavailable. Clients were notified by email and they were refounded for the unavailable product.',
        });
        setUnavailableProduct(-1);
      } catch (error) {
        console.log(error);
        setActionAlert({
          variant: 'danger',
          msg: 'Oops! Could not mark product as unavailable. Please try again',
        });
      }
    };
    removeItems();
  }, [unavailableProduct]);

  const capitalizeEachFirstLetter = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
  };

  const confirmProductsAvailable = () => {
    //Monday
    if (dayjs(props.time.date).day() === 1) {
      if (dayjs('01/01/2021 ' + props.time.hour).hour() < 9) {
        //Before MON 9AM -> available
        return true;
      }
      //After MON 9AM -> unavailable
      else {
        //next week = week + 2
        return false;
      }
    } else {
      return false;
    }
  };

  return (
    <>
      <div className="d-block w-100">
        <span className="d-block text-center mt-5 mb-2 display-2">
          Confirm Product availability
        </span>
        <h5 className="d-block mx-auto mb-5 text-center text-muted">
          Select the items which you want to confirm for the upcoming week.
          <br />
        </h5>

        {actionAlert && (
          <Alert
            variant={actionAlert.variant}
            className="text-center my-3 mx-5"
            dismissible={true}
            onClose={() => setActionAlert(null)}
          >
            {actionAlert.msg}
          </Alert>
        )}

        {showLoading && (
          <div className="d-block text-center p-5">
            <Spinner className="m-5" animation="grow" />
          </div>
        )}
        {
          /*DISPLAYING NOTIFICATION IF NO PRODUCTS INSERTED YET*/
          bookedProducts.length === 0 ? (
            <div className="d-block text-center">
              You have already confirmed all products for the next week.
            </div>
          ) : (
            ''
          )
        }

        {/*DISPLAYING CURRENTLY INSERTED PRODUCTS*/}
        <ul className="list-group list-group-flush mx-auto w-75">
          {bookedProducts.map((product) => {
            return (
              <li key={product.id} className="list-group-item">
                <div className="row w-100">
                  <div className="col-md-1 my-auto">
                    <img
                      className="w-100 rounded-circle"
                      src={
                        process.env.PUBLIC_URL +
                        'products/' +
                        product.id +
                        '.jpg'
                      }
                      alt="Product img"
                    />
                  </div>
                  <div className="col-md-5 text-start my-auto">
                    <h4>{capitalizeEachFirstLetter(product.name)}</h4>
                  </div>
                  <div className="col-md-3 text-start my-auto">
                    {stockIcon} {product.quantity + ' ' + product.unit}
                  </div>
                  <div className="col-md-3 text-center my-auto">
                    <button
                      className="d-block btn btn-success mb-2 mx-auto"
                      onClick={() => {
                        setConfirmedProduct(product.id);
                      }}
                    >
                      Confirm product available
                    </button>
                    <button
                      className="d-block btn btn-danger mx-auto"
                      onClick={() => {
                        setUnavailableProduct(product.id);
                      }}
                    >
                      Mark as unavailable & notify clients
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <hr />
        <div className="d-flex justify-content-end">
          <Link to="/farmer">
            <Button variant="outline-success">Back to Farmer Area</Button>
          </Link>
        </div>
        <div className="d-block mb-5 text-center"></div>
      </div>
      {!confirmProductsAvailable() && (
        <Modal
          show={true}
          dismissible={false}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body>
            The confirming windows is available only <b>on Monday until 9 AM</b>
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

export default FarmerOrderConfirmation;
