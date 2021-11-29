import { Button, Row, Carousel, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom"
import API from "../API";


function FarmerArea(props) {

    const [confirmationStatus, setConfirmationStatus] = useState();

    useEffect(()=>{
        const getConfirmationStatus = async () => {
            const status = await API.getProviderConfirmationStatus(2021, 2);
            setConfirmationStatus(status);
        }
        getConfirmationStatus();
    },[]);
 
    return (
        <div className="row w-100">

            <div><Button variant="light" style={{ 'fontSize': 30, 'borderStyle': 'hidden', 'position': 'absolute', 'right': '30px' }} onClick={props.logout}><Link to="/">LOGOUT</Link></Button>
            </div>

            <span className="d-block text-center mt-5 mb-2 display-2">
                Farmer Area
            </span>
            <div className="col-lg-3">
                <div className="card mx-3 my-2 shadow-sm">
                    <div className="card-header d-flex justify-content-between">
                        <h5 className="d-inline my-auto">Your profile</h5>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between">
                            Farmer data here
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            Farmer data here
                        </li>
                    </ul>
                </div>
                <div className="card mx-3 my-2 shadow-sm">
                    <div className="card-header d-flex justify-content-between">
                        <h5 className="d-inline my-auto">Farmer data</h5>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between">
                            Farmer data here
                        </li>
                    </ul>
                </div>
            </div>
            <div className="col-lg-9 ">
                <div className="row w-100">
                    <div className="col-lg-12">
                        <div className="card m-3 w-100">
                            <div className="row no-gutters">
                                <div className="col-md-4 bg-secondary p-3 text-center">
                                    {cartIcon}
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">Declare products availability</h5>
                                        <p>Here you can report the expected available product amounts for the next week</p>
                                        <p className="card-text">
                                            {confirmationStatus &&
                                            <span className="text-success">Availability successfully confirmed. Product declaration will be available again next week.</span>
                                            }
                                            • You can declare items for the next week from Monday until Saturday 09.00AM <br />
                                        </p>
                                        <div className="d-block text-end">
                                            <Link to="/declare-availability">
                                                <button className="btn btn-primary">Declare availability</button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row w-100">
                    <div className="col-lg-12">
                        <div className="card m-3 w-100">
                            <div className="row no-gutters">
                                <div className="col-md-4 bg-secondary p-3 text-center">
                                    {walletIcon}
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">Confirm product availability</h5>
                                        <p className="card-text">
                                            • You can confirm items availability starting Saturday 09.00AM until Monday 09.00AM <br />
                                            <br/>
                                        </p>
                                        <div className="d-block text-end">
                                            <Link to="/order-confirmation-farmer">
                                            <button className="btn btn-primary" >Confirm availability</button>
                                             </Link> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row w-100">
                    <div className="col-lg-12">
                        <div className="card m-3 w-100">
                            <div className="row no-gutters">
                                <div className="col-md-4 bg-secondary p-3 text-center">
                                    {cartIcon}
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">Confirm order preparation</h5>
                                        <p className="card-text">
                                            • Confirm the preparation of the booked orders to ship to the SPG shop
                                        </p>
                                        <div className="d-block text-end">
                                            <Link to="/order-preparation">
                                                <button className="btn btn-primary">Confirm preparation</button>
                                            </Link>
                                        </div>
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

const cartIcon = <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
</svg>

const walletIcon = <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="currentColor" className="bi bi-wallet" viewBox="0 0 16 16">
    <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z" />
</svg>

export default FarmerArea;
