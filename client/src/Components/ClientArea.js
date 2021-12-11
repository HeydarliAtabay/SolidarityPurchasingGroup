import { Button } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import ClientAlert from './ClientAlert';

function ClientArea(props) {
  
  const history = useHistory();

  return (
    <div className="row w-100">

      <span className="d-block text-center mt-5 mb-2 display-2">
        Client Area
      </span>
      <div className="d-block">
        <ClientAlert clients={props.clients} clientid={props.clientid} />
      </div>
      <div className="col-lg-3">
        <div className="card mx-3 my-2 shadow-sm">
          <div className="card-header d-flex justify-content-between">
            <h5 className="d-inline my-auto">Your profile</h5>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between">
              {props.userName}
            </li>
            <li className="list-group-item d-flex justify-content-between">
              {props.userMail}
            </li>
          </ul>
        </div>
        <div className="card mx-3 my-2 shadow-sm">
          <div className="card-header d-flex justify-content-between">
            <h5 className="d-inline my-auto">Your wallet</h5>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between">
              Wallet data here
            </li>
          </ul>
        </div>
        <div className="d-block mx-3 my-4">
          <button className="btn btn-outline-secondary w-100" onClick={() => { props.logout(); history.push("/") }}>Logout</button>
        </div>
      </div>
      <div className="col-lg-9 ">
        <div className="card m-3 d-block shadow">
          <div className="row no-gutters">
            <div className="col-md-4 p-3 text-center" style={{background: "linear-gradient(to right, #8C7161 80%, #FFFFFF)"}}>
              {cartIcon}
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">Browse products</h5>
                <p className="card-text">
                  • View &#38; search products<br />
                  • Book products<br />
                  • Explore next week products
                </p>
                <div className="d-block text-end">
                  <Link to="/booking">
                    <button className="btn me-2 mt-3" style={{backgroundColor: "#8C7161", color: "white"}}>Browse products</button>
                  </Link>
                  <Link to="/products-next-week">
                    <button className="btn mt-3" style={{backgroundColor: "#8C7161", color: "white"}}>
                      Products available next week
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card m-3 d-block shadow">
          <div className="row no-gutters">
            <div className="col-md-4 p-3 text-center" style={{background: "linear-gradient(to right, #A65729 80%, #FFFFFF)"}}>
              {walletIcon}
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">My wallet</h5>
                <p className="card-text">
                  • View balance
                  <br />• Wallet top-up
                </p>
                <div className="d-block text-end">
                  {/*<Link to="/wallet">*/}
                  <button className="btn mt-3" disabled={true} style={{backgroundColor: "#A65729", color: "white"}}>
                    Wallet
                  </button>
                  {/* </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card m-3 d-block shadow">
          <div className="row no-gutters">
            <div className="col-md-4 p-3 text-center" style={{background: "linear-gradient(to right, #402A22 80%, #FFFFFF)", color: 'white'}}>
              {cartIcon}
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">My orders</h5>
                <p className="card-text">
                  • View scheduled deliveries
                  <br />
                  • View scheduled pick-ups
                </p>
                <div className="d-block text-end">
                  <Link to="/orders">
                    <button className="btn mt-3" disabled={false} style={{backgroundColor: "#402A22", color: "white"}}>
                      View orders
                    </button>
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

export default ClientArea;
