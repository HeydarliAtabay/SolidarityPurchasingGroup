import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ManagerArea(props) {
  return (
    <div className="row w-100">
      
      <span className="d-block text-center mt-5 mb-2 display-2">
        Shop Manager Area
      </span>
      <div className="col-lg-3">
        <div className="card mx-3 my-2 shadow-sm">
          <div className="card-header d-flex justify-content-between">
            <h5 className="d-inline my-auto">Your profile</h5>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between">
              Manager data here
            </li>
            <li className="list-group-item d-flex justify-content-between">
              Manager data here
            </li>
          </ul>
        </div>
      </div>
      <div className="col-lg-9 ">
        <div className="card m-3 d-block">
          <div className="row no-gutters">
            <div className="col-md-4 bg-secondary p-3 text-center">
              {cartIcon}
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">Pending farmer applications</h5>
                <p className="card-text">
                  • View &#38; browse pending farmer applications<br />
                  • Accept or decline a farmer application<br />
                </p>
                <div className="d-block text-end">
                  <Link to="/manager/applications/pending">
                    <button className="btn btn-primary">Browse pending applications</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card m-3 d-block">
          <div className="row no-gutters">
            <div className="col-md-4 bg-secondary p-3 text-center">
              {cartIcon}
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">Accepted/rejected farmer applications</h5>
                <p className="card-text">
                  • View &#38; browse accepted or rejected farmer applications<br />
                  • Inspect a farmer application<br />
                  • Accept a previously rejected application<br/>
                </p>
                <div className="d-block text-end">
                  <Link to="/manager/applications/processed">
                    <button className="btn btn-primary">Browse processed applications</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const cartIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="128"
    height="128"
    fill="currentColor"
    className="bi bi-cart3"
    viewBox="0 0 16 16"
  >
    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
  </svg>
);

const walletIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="128"
    height="128"
    fill="currentColor"
    className="bi bi-wallet"
    viewBox="0 0 16 16"
  >
    <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z" />
  </svg>
);

export default ManagerArea;
