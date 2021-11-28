import { Button, Modal, Row, Col, Form, FloatingLabel, Spinner, Alert } from 'react-bootstrap';
import API from '../API';
const { useState, useEffect } = require("react");



function FarmerOrderPreparation(props) {

    /*products arrays*/
    const [bookedProducts, setBookedProducts] = useState([]);

    /*modal show states*/
    const [showNewProductModal, setShowNewProductModal] = useState(false);
    const [modifyProductID, setModifyProductID] = useState(-1);
    const [removeProductID, setRemoveProductID] = useState(-1);

    /*save status alert*/
    const [shipAlert, setShipAlert] = useState(null);

    /*spinning circle*/
    const [showLoading, setShowLoading] = useState(true);

    /*useEffect triggers*/
    const [saveAvailability, setSaveAvailability] = useState(false);
    const [refreshExpected, setRefreshExpected] = useState(true);

    /*USEFFECTS*/
    useEffect(() => {
        const getBookedOrders = async () => {
            setShowLoading(true);
            const prods = (await API.getOrderedProductsForProvider(2021, 1)).map((p)=>({...p, prepared: 0}));
            setBookedProducts(prods);
            setShowLoading(false);
        }
        getBookedOrders();
    }, [])

    /*Utility functions*/
    const capitalizeEachFirstLetter = (str) => {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
    }

    return (
        <>
            <div className="container-fluid mx-5 w-max100-custom">
                <span className="d-block text-center mt-5 mb-2 display-2">
                    Order preparation
                </span>
                <h5 className="d-block mx-auto mb-5 text-center text-muted">
                    Select the items which you have prepared for shipping.<br />
                    After selecting all the items you can ship the order.
                </h5>
                {shipAlert &&
                    <Alert variant={shipAlert.variant} dismissible={true} onClose={() => (setShipAlert(null))}>
                        {shipAlert.msg}
                    </Alert>
                }
                {showLoading &&
                    <div className="d-block text-center p-5">
                        <Spinner className="m-5" animation="grow" />
                    </div>
                }
                {!showLoading &&
                    <div className="d-block text-center">
                        {/*DISPLAYING NOTIFICATION IF NO PRODUCTS INSERTED YET*/
                            bookedProducts.length === 0 ?
                                <div className="d-block text-center">
                                    No orders received.
                                </div>
                                :
                                ''
                        }
                        {/*DISPLAYING CURRENTLY INSERTED PRODUCTS*/}
                        <ul class="list-group list-group-flush mx-auto w-75">
                            {bookedProducts.map((product) => {
                                return (
                                    <li key={product.id} class="list-group-item">
                                        <div className="row w-100">
                                            <div className="col-md-1">
                                                <img className="w-100 rounded-circle" 
                                                    src={process.env.PUBLIC_URL + 'products/' + product.id + '.jpg'}
                                                    alt="Product img"
                                                />
                                            </div>
                                            <div className="col-md-5 text-start my-auto">
                                                <h4>{capitalizeEachFirstLetter(product.name)}</h4>
                                            </div>
                                            <div className="col-md-3 text-start my-auto">
                                                {stockIcon} {product.tot_quantity+' '+product.unit}
                                            </div>
                                            <div className="col-md-3 text-center my-auto">
                                                {product.prepared===0 && <button className="btn btn-success" onClick={()=>(
                                                    setBookedProducts((p)=>{
                                                        
                                                    })
                                                )}>Confirm prepared</button>}    
                                                {product.prepared===1 && <span className="d-block text-center">{checkIcon}</span>}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                }
                <hr />
                <div className="d-block mb-5 text-center">
                    <button className="mx-2 p-3 btn btn-primary" onClick={() => (setSaveAvailability(true))}>Confirm items shipment</button>
                </div>
            </div>
        </>
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
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
</svg>
);

export default FarmerOrderPreparation;