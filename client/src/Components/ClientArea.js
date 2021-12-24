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
        <ClientAlert clients={props.clients}  orders={props.orders}  clientid={props.clientid} />
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
            <div className="col-md-4 p-3 text-center" style={{backgroundColor: "#8C7161"}}>
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
            <div className="col-md-4 p-3 text-center" style={{backgroundColor: "#A65729"}}>
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
            <div className="col-md-4 p-3 text-center" style={{backgroundColor: "#402A22", color: 'white'}}>
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
        <div className="card m-3 d-block shadow">
          <div className="row no-gutters">
            <div className="col-md-4 p-3 text-center" style={{backgroundColor: "#0088CC", color: 'white'}}>
              {telegramIcon}
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">Telegram</h5>
                <h6>We have Telegram Bot and Telegram group for making our clients easily interact with our system</h6>
                <p className="card-text">
                  • Telegram bot - for getting individual details related to your account
                  <br />• Telegram Group - for getting informed about all updates of our SPG
                </p>
                <div className="d-block text-end">
                <div className="d-block text-end">
                  <a href="https://t.me/+mVUjc_29Qjo3Y2Q0" target="_blank">
                    <button className="btn me-2 mt-3" style={{backgroundColor: "#0088CC", color: "white"}}>Join our Telegram Group</button>
                  </a>
                  <a href="https://t.me/Solidarity_Purchase_Group_BOT" target="_blank">
                    <button className="btn mt-3" style={{backgroundColor: "#0088CC", color: "white"}}>
                      Try our Telegram Bot
                    </button>
                  </a>
                </div>
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
const telegramIcon =(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="128" height="128" fill="#0088CC" >
  <path d="M66.964 134.874s-32.08-10.062-51.344-16.002c-17.542-6.693-1.57-14.928 6.015-17.59 7.585-2.66 186.38-71.948 194.94-75.233 8.94-4.147 19.884-.35 14.767 18.656-4.416 20.407-30.166 142.874-33.827 158.812-3.66 15.937-18.447 6.844-18.447 6.844l-83.21-61.442z" fill="none" stroke="#000" stroke-width="10"/>
  <path d="M92.412 201.62s4.295.56 8.83-3.702c4.536-4.26 26.303-25.603 26.303-25.603" fill="none" stroke="#000" stroke-width="10"/>
  <path d="M66.985 134.887l28.922 14.082-3.488 52.65s-4.928.843-6.25-3.613c-1.323-4.455-19.185-63.12-19.185-63.12z" fill-rule="evenodd" stroke="#000" stroke-width="10" stroke-linejoin="bevel"/>
  <path d="M66.985 134.887s127.637-77.45 120.09-71.138c-7.55 6.312-91.168 85.22-91.168 85.22z" fill-rule="evenodd" stroke="#000" stroke-width="9.67" stroke-linejoin="bevel"/>
</svg>
)

export default ClientArea;
