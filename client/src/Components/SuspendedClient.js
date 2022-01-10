import { Link, useHistory } from 'react-router-dom';
import ClientAlert from './ClientAlert';
import { Alert, Button, Container, Modal, Row } from "react-bootstrap";
import { useState } from 'react';
import dayjs from 'dayjs';

function SuspendedClient(props) {

  const [showWalletModal, setShowWalletModal] = useState(false);

  const history = useHistory();

  let missedpickups = props.missed.filter(x => x.client_id === props.clientid);

  return (
    <>
      <div className='container-fluid'>
        <div className="row w-100">
          <span className="d-block text-center mt-5 mb-2 display-2">
            Client Area
          </span>
          <div className="d-block">
            <ClientAlert clients={props.clients} orders={props.orders} clientid={props.clientid} userRole={props.userRole} />
          </div>
            <div className="d-block">
              <div className="d-block my-3 mx-5 text-center">
                <Alert variant="danger">
                  <Alert.Heading><h3>ATTENTION: Account status information</h3></Alert.Heading>
                  <p>You have <b>5 missed pickups</b>. Your accound will be <b>suspended</b> until XXX !</p>
                </Alert>
              </div>
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
                  Budget: {props.clients.find((c) => (c.client_id === props.clientid)) ? props.clients.find((c) => (c.client_id === props.clientid)).budget + "€" : "0.00€"}
                </li>
              </ul>
            </div>
            <div className="d-block mx-3 my-4">
              <button className="btn btn-outline-secondary w-100" onClick={() => { props.logout(); history.push("/") }}>Logout</button>
            </div>
          </div>
          <div className="col-lg-9">
            <div className="card m-3 d-block shadow">
              <div className="row no-gutters">
                <div className="col-md-4 p-3 text-center" style={{ backgroundColor: "#A65729" }}>
                  {walletIcon}
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">My wallet</h5>
                    <p className="card-text">
                      • View balance
                    </p>
                    <div className="d-block text-end">
                      <button className="btn mt-3" onClick={() => (setShowWalletModal(true))} style={{ backgroundColor: "#A65729", color: "white" }}>
                        Wallet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card m-3 d-block shadow">
              <div className="row no-gutters">
                <div className="col-md-4 p-3 text-center" style={{ backgroundColor: "#402A22", color: 'white' }}>
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
                      <button className="btn mt-3" disabled={false} style={{ backgroundColor: "#402A22", color: "white" }} onClick={() => (history.push("/orders"))}>
                        View orders
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card m-3 d-block shadow">
              <div className="row no-gutters">
                <div className="col-md-4 p-3 text-center" style={{ backgroundColor: "#0088CC", color: 'white' }}>
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
                          <button className="btn me-2 mt-3" style={{ backgroundColor: "#0088CC", color: "white" }}>Join our Telegram Group</button>
                        </a>
                        <a href="https://t.me/Solidarity_Purchase_Group_BOT" target="_blank">
                          <button className="btn mt-3" style={{ backgroundColor: "#0088CC", color: "white" }}>
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
      </div>

      <Modal show={showWalletModal} onHide={() => setShowWalletModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Wallet balance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='d-block text-center'>
            <h4 className='d-inline-block text-muted me-3'>Available wallet balance</h4>
            <h1 className='d-inline-block'>{props.clients.find((c) => (c.client_id === props.clientid)) && props.clients.find((c) => (c.client_id === props.clientid)).budget}€</h1>
          </div>
          {props.orders.filter((o) => (o.client_id === props.clientid && o.state === 'pending')).length > 0 &&
            <div className='d-block text-danger text-center my-auto'>
              {dangerIcon} You have orders that are <b>pending payment</b>. Please contact the SPG shop to top-up your wallet and confirm the order payment.
            </div>
          }
          {props.orders.filter((o) => (o.client_id === props.clientid && o.state === 'pending')).length === 0 &&
            <>
              <div className='d-block text-success text-center my-auto py-4'>
                {successIcon} Congratulations! You have no orders that are pending payment.
              </div>
              <div className='d-block text-muted text-center my-auto'>
                {infoIcon} If you want to top-up your wallet you can contact the SPG shop and we will top-up your wallet balance.
              </div>
            </>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowWalletModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </>
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
const telegramIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="128" height="128" fill="#0088CC" >
    <path d="M66.964 134.874s-32.08-10.062-51.344-16.002c-17.542-6.693-1.57-14.928 6.015-17.59 7.585-2.66 186.38-71.948 194.94-75.233 8.94-4.147 19.884-.35 14.767 18.656-4.416 20.407-30.166 142.874-33.827 158.812-3.66 15.937-18.447 6.844-18.447 6.844l-83.21-61.442z" fill="none" stroke="#000" strokeWidth="10" />
    <path d="M92.412 201.62s4.295.56 8.83-3.702c4.536-4.26 26.303-25.603 26.303-25.603" fill="none" stroke="#000" strokeWidth="10" />
    <path d="M66.985 134.887l28.922 14.082-3.488 52.65s-4.928.843-6.25-3.613c-1.323-4.455-19.185-63.12-19.185-63.12z" fillRule="evenodd" stroke="#000" strokeWidth="10" strokeLinejoin="bevel" />
    <path d="M66.985 134.887s127.637-77.45 120.09-71.138c-7.55 6.312-91.168 85.22-91.168 85.22z" fillRule="evenodd" stroke="#000" strokeWidth="9.67" strokeLinejoin="bevel" />
  </svg>
)

const dangerIcon = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-exclamation-triangle" viewBox="0 0 16 16">
  <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
  <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
</svg>

const successIcon = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
  <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
</svg>

const infoIcon = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
</svg>


export default SuspendedClient;