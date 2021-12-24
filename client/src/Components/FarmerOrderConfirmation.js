import { Button, Spinner } from 'react-bootstrap';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import API from '../API';
const { useState, useEffect } = require('react');

function FarmerOrderConfirmation(props) {
  /*products arrays*/
  const [bookedProducts, setBookedProducts] = useState([]);
  const [confirmedProduct, setConfirmedProduct] = useState(0);

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
      console.log(props.time);
      const weekpassedtmp = dayjs(props.time.date).add(1, 'week');
      let year = dayjs(weekpassedtmp).year();
      let weekpassed = dayjs(weekpassedtmp).week();
      if (dayjs(props.time.date).day() === 1) {
        weekpassed = dayjs(props.time.date).week();
        year = dayjs(props.time.date).year();
      }
      console.log(weekpassed);
      console.log(year);

      const prods = (
        await API.getProviderExpectedProducts(year, weekpassed)
      ).map((p) => ({ ...p, prepared: 0 }));
      setBookedProducts(prods);
      setRefreshData(false);
      setShowLoading(false);
    };
    getBookedOrders();
  }, [refreshData, props.time]);

  useEffect(() => {
    if (confirmedProduct !== 0) {
      const shipItems = async () => {
        const weekpassedtmp = dayjs(props.time.date).add(1, 'week');
        let year = dayjs(weekpassedtmp).year();
        let weekpassed = dayjs(weekpassedtmp).week();
        if (dayjs(props.time.date).day() === 1) {
          weekpassed = dayjs(props.time.date).week();
          year = dayjs(props.time.date).year();
        }
        await API.confirmExpectedProducts(confirmedProduct, year, weekpassed);
        setRefreshData(true);
      };
      shipItems();
    }
  }, [confirmedProduct, props.time]);

  const capitalizeEachFirstLetter = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
  };

  return (
    <>
      <div className="container-fluid mx-5 w-max100-custom">
        <span className="d-block text-center mt-5 mb-2 display-2">
          Confirm Product availability
        </span>
        <h5 className="d-block mx-auto mb-5 text-center text-muted">
          Select the items which you want to confirm for the upcoming week.
          <br />
        </h5>
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
                    {product.prepared === 0 && (
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          setConfirmedProduct(product.id);
                        }}
                      >
                        Confirm product
                      </button>
                    )}

                    {product.prepared === 1 && (
                      <span className="d-block text-center text-success">
                        {checkIcon} Confirmed
                      </span>
                    )}
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
