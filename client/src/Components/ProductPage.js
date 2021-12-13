import { useState } from 'react';

function ProductPage(props) {
  let imgName = props.prod.id + '.jpg';

  const [buyQuantity, setBuyQuantity] = useState(1);

  const RemoveProduct = () => {
    if (props.prod.quantity === 0) {
      return;
    }
    setBuyQuantity((qty) => {
      if (qty - 0.5 <= 0) {
        return qty;
      }
      return qty - 0.5;
    });
  };

  const AddProduct = () => {
    if (props.prod.quantity === 0) {
      return;
    }
    setBuyQuantity((qty) => {
      if (qty + 0.5 > props.prod.quantity) {
        return qty;
      }
      return qty + 0.5;
    });
  };

  return (
    <div className="product-modal-size-custom">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 text-center mb-4">
            <img
              className="product-image-size-custom rounded-pill shadow my-auto"
              src={process.env.PUBLIC_URL + 'products/' + imgName}
              alt="Product"
            />
          </div>
          <div className="col-lg-6">
            <div className="form-row align-items-center">
              <div className="row">
                <div className="col-sm-7">
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">Quantity</div>
                    </div>
                    <input
                      className="form-control text-center"
                      value={props.prod.quantity > 0 ? buyQuantity + ' ' + props.prod.unit : 'Sold out'}
                      onChange={() => {
                        return;
                      }}
                    />
                  </div>
                </div>
                <div className="col-sm-5 text-center">
                  {!props.browsing ? (
                    <>
                      <button
                        className="btn btn-primary rounded mx-2 product-buy-size-custom"
                        onClick={() => RemoveProduct()}
                        disabled={props.prod.quantity === 0}
                      >
                        -
                      </button>
                      <button
                        className="btn btn-primary rounded mx-2 product-buy-size-custom"
                        onClick={() => AddProduct()}
                        disabled={props.prod.quantity === 0}
                      >
                        +
                      </button>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            <div className="d-block text-center mt-3">
              {!props.browsing ? (
                <button
                  className="btn btn-success mx-2"
                  onClick={() => {
                    if (props.prod.quantity === 0) {
                      return;
                    }
                    props.onAdd(props.prod, buyQuantity);
                    props.setShowProductDetailsModal(false);
                  }}
                  disabled={props.prod.quantity === 0}
                >
                  Add to basket
                </button>
              ) : (
                <button disabled className="btn btn-success mx-2">
                  Add to basket
                </button>
              )}
            </div>
            <hr />
            <div className="d-block mx-2">
              <div className="d-block my-2">
                {categoryIcon} <b>{props.prod.category}</b>
              </div>
              <div className="d-block my-2">
                {priceIcon}{' '}
                <b>
                  {props.prod.price} €/{props.prod.unit}
                </b>
              </div>
              <div className="d-block my-2">
                {producerIcon} <b>{props.prod.providerName}</b>
              </div>
              <div className="d-block my-2">
                {stockIcon}{' '}
                <b>
                  {props.prod.quantity} {props.prod.unit} available
                </b>
              </div>
              {props.prod.expiryDate ? (
                <div className="d-block my-2">
                  {expiryDateIcon} <b>{props.prod.expiryDate}</b>
                </div>
              ) : (
                ''
              )}
            </div>
            <hr />
            <div className="d-block my-1">
              <h5>More about this product</h5>
              <p className="text-wrap text-justify">{props.prod.description}</p>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="d-block">
        <div className="d-block">
          <div className="d-inline-block">{producerIconBig}</div>
          <div className="d-inline-block mx-3 mb-4">
            <blockquote className="blockquote">
              <p>{props.prod.providerName}</p>
              <footer className="blockquote-footer">
                <cite title="Source Title">Torino</cite>
              </footer>
            </blockquote>
          </div>
        </div>
        <div className="d-block">
          Very professional. Has been doing this job for more than 30 years.
        </div>
      </div>
    </div>
  );
}

const categoryIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-bookmark"
    viewBox="0 0 16 16"
  >
    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
  </svg>
);

const priceIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-tag"
    viewBox="0 0 16 16"
  >
    <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z" />
    <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z" />
  </svg>
);

const producerIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-person-badge"
    viewBox="0 0 16 16"
  >
    <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    <path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0h-7zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492V2.5z" />
  </svg>
);

const producerIconBig = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    fill="currentColor"
    className="bi bi-person-circle"
    viewBox="0 0 16 16"
  >
    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    <path
      fillRule="evenodd"
      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
    />
  </svg>
);

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

const expiryDateIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-calendar3"
    viewBox="0 0 16 16"
  >
    <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
    <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  </svg>
);

export default ProductPage;
