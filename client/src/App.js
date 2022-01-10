import './App.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './Components/MyNavbar';
import Frontpage from './Components/Frontpage';
import Booking from './Components/Booking';
import Orders from './Components/Orders';
import { clientOrders } from './classes/ClientOrder';
import API from './API';
import { MPickups } from './classes/MissedPickups';
import PickupOrders from './Components/PickupOrders';
import EmployeePage from './Components/EmployeePage';
import UserRegistration from './Components/UserRegistration';
import { useState, useEffect } from 'react';
import { Container, Alert, Row, Button, Fade } from 'react-bootstrap';
import {
  Redirect,
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
import { Link } from 'react-router-dom';
import { LoginForm1 } from './Components/LoginForm';
import ClientArea from './Components/ClientArea';
import FarmerRegistration from './Components/FarmerRegistration';
import FarmerArea from './Components/FarmerArea';
import FarmerProducts from './Components/FarmerProducts';
import FarmerOrderPreparation from './Components/FarmerOrderPreparation';
import FarmerOrderConfirmation from './Components/FarmerOrderConfirmation';
import ManagerFarmers from './Components/ManagerFarmers';
import ManagerArea from './Components/ManagerArea';
import dayjs from 'dayjs';
import DeliveryPage from './Components/DeliveryPage';
import Fbookings from './Components/FarmerPageOrders';
import WarehouseManagerArea from './Components/WarehouseManagerArea';
import WarehouseEmployeeArea from './Components/WarehouseEmployeeArea';
import WarehouseManagerOrders from './Components/WarehouseManagerOrders';
import WarehouseManagerShipments from './Components/WarehouseManagerShipments';
import WarehouseEmployeePrepare from './Components/WarehouseEmployeePrepare';
import Cart from './Components/Cart';
import SuspendedClient from './Components/SuspendedClient';

let r = [];

function App() {

  const history = useHistory();

  const [time, setTime] = useState({
    date: dayjs().format('MM-DD-YYYY'),
    hour: dayjs().format('HH:mm'),
  });
  const [recharged, setRecharged] = useState(true);
  const [recharged1, setRecharged1] = useState(true);
  const [recharged2, setRecharged2] = useState(true);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [missed, setMissed] = useState([]);
  const [confirmedProducts, setConfirmedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [expectedProducts, setExpectedProducts] = useState([]);
  const [update, setUpdate] = useState(false); //used when an order is confirmed in order to update the quantity
  const [methods, setMethods] = useState([]);
  const [message, setMessage] = useState('');
  const [userid, setUserid] = useState();
  const [providerid, setProviderid] = useState();
  const [logged, setLogged] = useState(false);
  const [providers, setProviders] = useState();
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [userMail, setUserMail] = useState('');
  const [userName, setUserName] = useState('');
  const [suspended, setSuspended] = useState(0);

  const [cartItems, setCartItems] = useState(new Map());
  const [cartUpdated, setCartUpdated] = useState(false);

  const [orderChangeItemID, setOrderChangeItemID] = useState(-1);
  const [orderAddItemID, setOrderAddItemID] = useState(-1);

  const [orderModified, setOrderModified] = useState(null);

  const [authAlert, setAuthAlert] = useState(null);
  const [cartAlert, setCartAlert] = useState(null);

  const updateRech = (x) => {
    setRecharged(x);
  };
  const updateRech1 = (x) => {
    setRecharged1(x);
  };
  const updateRech2 = (x) => {
    setRecharged2(x);
  };
  /*USEFFECT LOGIN*/
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.getUserInfo();
      } catch (err) {
        console.error(err.error);
      }
    };
    checkAuth();
  }, []);
  /* USEFFECT users */
  useEffect(() => {
    const getAllUsers = async () => {
      await API.getAllUsers()
        .then((res) => {
          setUsers(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAllUsers();
  }, []);
  /* USEFFECT missed */
  useEffect(() => {
    const getAllMPickups = async () => {
      await API.getAllMissedPickups()
        .then((res) => {
          setMissed(res);
          setRecharged2(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAllMPickups();
  }, [recharged2]);
  /* USEFFECT clients */
  useEffect(() => {
    const getAllClients = async () => {
      await API.getAllClients()
        .then((res) => {
          setClients(res);
          setRecharged1(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (recharged1) getAllClients();
  }, [recharged1]);

  /* USEFFECT providers */
  useEffect(() => {
    const getAllProviders = async () => {
      await API.getAllProviders()
        .then((res) => {
          setProviders(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAllProviders();
  }, [update]);

  /* USEFFECT orders*/
  useEffect(() => {
    const pr = () => {
      API.getAllOrders().then((data) => {
        data.forEach((x) => {
          r.push(
            new clientOrders(
              x.order_id,
              x.client_id,
              x.product_name,
              x.product_id,
              x.order_quantity,
              x.state,
              x.farmer_state,
              x.OrderPrice,
              x.id,
              x.address,
              x.city,
              x.zipcode,
              x.Nation,
              x.date,
              x.time,
              x.pickup
            )
          );
        });
        let om = [...r];
        r = [];
        setOrders(om);
        setRecharged(false);
      });
    };
    if (recharged) pr();
  }, [recharged]);

  /*USEFFECT products*/
  useEffect(() => {
    const getAllConfirmedProducts = async () => {
      await API.getAllConfirmedProducts(2021, 1)
        .then((res) => {
          setConfirmedProducts(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAllConfirmedProducts();
  }, [update]);
  /*USEFFECT products*/
  useEffect(() => {
    const getAllProducts = async () => {
      await API.getAllProducts()
        .then((res) => {
          console.log(res);
          setProducts(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAllProducts();
  }, []);

  /*USEFFECT for expected products*/
  useEffect(() => {
    const getAllExpectedProducts = async () => {
      await API.getAllExpectedProducts(2021, 2)
        .then((res) => {
          setExpectedProducts(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAllExpectedProducts();
  }, [update]);

  useEffect(() => {
    API.getAllPaymentMethods().then((newMethods) => {
      setMethods(newMethods);
    });
  }, []);

  function addTransaction(tr) {
    API.addTransaction(tr)
      .then((err) => {
        console.log('Transaction was added');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /* USEFFECT Telegram Notification */
  useEffect(() => {
    let dayOfWeek = dayjs(time.date).day();
    if (dayOfWeek === 6 && time.hour === '09:00') {
      const SendNotification = async () => {
        await API.sendTelegramNotificationOnSaturday()
          .then((res) => {
            console.log('telegram message was sent to group');
          })
          .catch((err) => {
            console.log(err);
          });
      };
      SendNotification();
    }

    if (time.hour === '10:00') {
      const SendNotificationAboutInsufficientBalance = async () => {
        await API.sendTelegramNotificationAboutInsufficientBalanceEveryDayAt10()
          .then((res) => {
            console.log('telegram message was sent to the user');
          })
          .catch((err) => {
            console.log(err);
          });
      };
      SendNotificationAboutInsufficientBalance();
    }
  }, [time]);

  function topUpBalance(amount, client) {
    API.increaseBalance(amount, client)
      .then((err) => {
        console.log('Balance was topped up');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function updateProps() {
    setUpdate(!update);
  }

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);

      setLogged(true);
      setMessage('');

      let id, index;
      if (user.role === 'client') {
        index = clients
          .filter((x) => x.email === user.username && x.name === user.name)
          .map((x) => x.client_id);
        id = index[0];
      } else id = user.id;

      if (user.role === 'farmer') {
        let y = providers.filter((x) => x.name === user.name).map((x) => x.id);
        let p = y[0];
        setProviderid(p);
      }

      setUserid(id);
      setUserRole(user.role);
      setUserMail(user.username);
      setUserName(user.name);

      if (user.suspended === 0) {
        setSuspended(0);
      }
      else setSuspended(1);


      setCartItems(new Map());
      setCartUpdated(true);

      setCartAlert(null);
      setAuthAlert({
        variant: 'success',
        msg: 'Welcome, ' + user.name + '! The login was successful.',
      });

      setTimeout(() => {
        setAuthAlert(null);
      }, 10000);

      if (user.role === 'client') {
        if (user.suspended === 0)
          return <Redirect to="/client" />;
        else
          return <Redirect to="/suspended-client" />;
      }
      else if (user.role === 'employee') {
        return <Redirect to="/employee" />;
      } else if (user.role === 'farmer') {
        return <Redirect to="/farmer" />;
      } else if (user.role === 'warehouse-employee') {
        return <Redirect to="/warehouse-employee" />;
      } else if (user.role === 'warehouse-manager') {
        return <Redirect to="/warehouse-manager" />;
      } else if (user.role === 'delivery-personnel') {
        return <Redirect to="/delivery" />;
      } else if (user.role === 'shop-manager') {
        return <Redirect to="/manager" />;
      }
    } catch (err) {
      console.log(err);
      setMessage('Oops! Could not perform login. Please try again later.');
    }
  };

  const doLogOut = async () => {
    await API.logOut();

    setCartAlert(null);
    setAuthAlert({
      variant: 'danger',
      msg: 'Goodbye, ' + userName + '! We hope to see you soon.',
    });

    setTimeout(() => {
      setAuthAlert(null);
    }, 7500);

    setLogged(false);
    setUserRole('');
    setUserMail('');
    setUserName('');
    setUserid(-1);
    setSuspended(0);

    return <Redirect to="/" />;
  };

  return (
    <Router>
      <MyNavbar
        time={time}
        loggedIn={logged}
        logout={doLogOut}
        login={doLogIn}
        userRole={userRole}
        userName={userName}
        userMail={userMail}
        setTime={setTime}
        cartItems={cartItems}
        cartUpdated={cartUpdated}
        setCartUpdated={setCartUpdated}
        clientid={userid}
        suspended={suspended}
      />

      {cartAlert && (
        <Row
          style={{
            position: 'fixed',
            zIndex: 1000,
            marginTop: 20,
            right: 10,
            paddingRight: 15
          }}>
          <Alert
            variant={cartAlert.variant}
            className="d-inline my-3"
            dismissible={true}
            onClose={() => setCartAlert(null)}
          >
            {cartAlert.msg}
            <div className='d-block text-end my-2'>
              <Link to='/cart'><Button variant='outline-light' onClick={() => (setCartAlert(null))}>Go to cart</Button></Link>
            </div>
          </Alert>
        </Row>
      )}

      {authAlert && (
        <Row
          style={{
            position: 'fixed',
            zIndex: 1000,
            marginTop: 20,
            right: 10,
          }}
          className="text-end me-2"
        >
          <Alert
            variant={authAlert.variant}
            className="d-inline my-3 mx-2"
            dismissible={true}
            onClose={() => setAuthAlert(null)}
          >
            {authAlert.msg}
          </Alert>
        </Row>
      )}

      <div className="container-fluid w-100">
        <Switch>
          <Route
            path="/cart"
            exact
            render={() =>
              logged ? (
                <Cart
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  setCartUpdated={setCartUpdated}
                  time={time}
                  logged={logged}
                  userRole={userRole}
                  products={confirmedProducts}
                  orders={orders}
                  clients={clients}
                  clientid={userid}
                  setRecharged={updateRech}
                  setRecharged1={updateRech1}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/booking"
            exact
            render={() =>
              logged ? (
                <Booking
                  cartItems={cartItems}
                  setCartUpdated={setCartUpdated}
                  setCartItems={setCartItems}
                  purchasing={true}
                  browsing={false}
                  orderChangeItem={false}
                  orderAddItem={false}
                  logged={logged}
                  orders={orders}
                  userRole={userRole}
                  clients={clients}
                  updateProps={updateProps}
                  time={time}
                  clientid={userid}
                  setRecharged={updateRech}
                  setRecharged1={updateRech1}
                  setAuthAlert={setAuthAlert}
                  setCartAlert={setCartAlert}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/products-next-week"
            exact
            render={() => (
              <Booking
                cartItems={cartItems}
                setCartUpdated={setCartUpdated}
                setCartItems={setCartItems}
                browsing={true}
                purchasing={false}
                orderChangeItem={false}
                orderAddItem={false}
                logged={logged}
                userRole={userRole}
                updateProps={updateProps}
                time={time}
                clientid={userid}
                setRecharged={updateRech}
                setRecharged1={updateRech1}
                clients={clients}
                setAuthAlert={setAuthAlert}
                setCartAlert={setCartAlert}
              />
            )}
          />
          < Route
            path="/orders"
            exact
            render={() =>
              logged ? (
                <Orders
                  orders={orders}
                  clientid={userid}
                  products={products}
                  setRecharged={updateRech}
                  setOrderChangeItemID={setOrderChangeItemID}
                  setOrderAddItemID={setOrderAddItemID}
                  orderChangeItemID={orderChangeItemID}
                  orderAddItemID={orderAddItemID}
                  orderModified={orderModified}
                  setOrderModified={setOrderModified}
                  time={time}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/staff-booking"
            exact
            render={() =>
              logged ? (
                <Booking
                  cartItems={cartItems}
                  setCartUpdated={setCartUpdated}
                  setCartItems={setCartItems}
                  browsing={false}
                  purchasing={true}
                  orderChangeItem={false}
                  orderAddItem={false}
                  logged={logged}
                  clients={clients}
                  orders={orders}
                  userRole={userRole}
                  clientid={userid}
                  setRecharged={updateRech}
                  setRecharged1={updateRech1}
                  updateProps={updateProps}
                  time={time}
                  setAuthAlert={setAuthAlert}
                  setCartAlert={setCartAlert}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/change-item"
            exact
            render={() =>
              logged ? (
                <Booking
                  cartItems={cartItems}
                  setCartUpdated={setCartUpdated}
                  setCartItems={setCartItems}
                  browsing={false}
                  purchasing={false}
                  orderChangeItem={true}
                  orderChangeItemID={orderChangeItemID}
                  setOrderModified={setOrderModified}
                  orderAddItem={false}
                  logged={logged}
                  clients={clients}
                  orders={orders}
                  userRole={userRole}
                  clientid={userid}
                  setRecharged={updateRech}
                  setRecharged1={updateRech1}
                  updateProps={updateProps}
                  time={time}
                  setAuthAlert={setAuthAlert}
                  setCartAlert={setCartAlert}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/add-item"
            exact
            render={() =>
              logged ? (
                <Booking
                  cartItems={cartItems}
                  setCartUpdated={setCartUpdated}
                  setCartItems={setCartItems}
                  browsing={false}
                  purchasing={false}
                  orderChangeItem={false}
                  orderAddItem={true}
                  orderAddItemID={orderAddItemID}
                  setOrderModified={setOrderModified}
                  logged={logged}
                  clients={clients}
                  orders={orders}
                  userRole={userRole}
                  clientid={userid}
                  setRecharged={updateRech}
                  setRecharged1={updateRech1}
                  updateProps={updateProps}
                  time={time}
                  setAuthAlert={setAuthAlert}
                  setCartAlert={setCartAlert}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/employee"
            exact
            render={() =>
              logged ? (
                <EmployeePage
                  orders={orders}
                  clients={clients}
                  methods={methods}
                  products={products}
                  mail={userMail}
                  addTr={addTransaction}
                  topUp={topUpBalance}
                  setRecharged={updateRech}
                  setRecharged1={updateRech1}
                  logout={doLogOut}
                  time={time}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/warehouse-employee"
            exact
            render={() =>
              logged ? (
                <WarehouseEmployeeArea
                  userName={userName}
                  userMail={userMail}
                  orders={orders}
                  providers={providers}
                  methods={methods}
                  setRecharged={updateRech}
                  logout={doLogOut}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/warehouse-manager"
            exact
            render={() =>
              logged ? (
                <WarehouseManagerArea
                  userName={userName}
                  userMail={userMail}
                  orders={orders}
                  providers={providers}
                  methods={methods}
                  logout={doLogOut}
                  setRecharged={updateRech}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/warehouse-orders"
            exact
            render={() =>
              logged ? (
                <WarehouseManagerOrders
                  providers={providers}
                  orders={orders}
                  products={products}
                  clients={clients}
                  time={time}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/warehouse-prepare"
            exact
            render={() =>
              logged ? (
                <WarehouseEmployeePrepare
                  providers={providers}
                  orders={orders}
                  products={products}
                  clients={clients}
                  time={time}
                  setRecharged={updateRech}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/warehouse-shipments"
            exact
            render={() =>
              logged ? (
                <WarehouseManagerShipments
                  providers={providers}
                  orders={orders}
                  products={products}
                  clients={clients}
                  time={time}
                  setRecharged={setRecharged}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/delivery"
            exact
            render={() =>
              logged ? (
                <DeliveryPage
                  orders={orders}
                  providers={providers}
                  methods={methods}
                  mail={userMail}
                  userRole={userRole}
                  logout={doLogOut}
                  delivererId={userid}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/manager"
            exact
            render={() =>
              logged ? (
                <ManagerArea
                  userName={userName}
                  userMail={userMail}
                  logout={doLogOut}
                  time={time}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/manager/applications/pending"
            exact
            render={() =>
              logged ? (
                <ManagerFarmers
                  pendingOnly={true}
                  acceptedOnly={false}
                  time={time}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/manager/applications/processed"
            exact
            render={() =>
              logged ? (
                <ManagerFarmers
                  pendingOnly={false}
                  acceptedOnly={true}
                  time={time}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/farmer-apply"
            exact
            render={() => <FarmerRegistration time={time} />}
          />
          <Route
            path="/farmer"
            exact
            render={() =>
              logged ? (
                <FarmerArea
                  userId={userid}
                  userName={userName}
                  userMail={userMail}
                  time={time}
                  logout={doLogOut}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/see-bookings"
            exact
            render={() =>
              logged ? (
                <Fbookings
                  providerid={providerid}
                  products={products}
                  clients={clients}
                  orders={orders}
                  time={time}
                  setRecharged={updateRech}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/declare-availability"
            exact
            render={() =>
              logged ? <FarmerProducts time={time} /> : <Redirect to="/login" />
            }
          />
          <Route
            path="/order-preparation"
            exact
            render={() =>
              logged ? (
                <FarmerOrderPreparation time={time} orders={orders} products={products} setRecharged={updateRech} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />

          <Route
            path="/order-confirmation-farmer"
            exact
            render={() =>
              logged ? (
                <FarmerOrderConfirmation clients={clients} products={products} orders={orders} time={time} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/login"
            exact
            render={() => (
              <LoginForm1
                login={doLogIn}
                logged={logged}
                userID={userid}
                userRole={userRole}
                clients={clients}
                users={users}
                message={message}
                setMessage={setMessage}
                suspended={suspended}
              />
            )}
          />
          <Route
            path="/client"
            exact
            render={() =>
              logged ? (
                <ClientArea
                  missed={missed}
                  logout={doLogOut}
                  userRole={userRole}
                  userName={userName}
                  userMail={userMail}
                  clients={clients}
                  clientid={userid}
                  orders={orders}
                  users={users}
                  time={time}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/suspended-client"
            exact
            render={() =>
              logged ? (
                <SuspendedClient
                  missed={missed}
                  logout={doLogOut}
                  userRole={userRole}
                  userName={userName}
                  userMail={userMail}
                  clients={clients}
                  clientid={userid}
                  orders={orders}
                  time={time}
                  suspended={suspended}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />

          <Route
            path="/see-pickups"
            exact
            render={() =>
              logged ? (
                <PickupOrders
                  clients={clients}
                  orders={orders}
                  missed={missed}
                  orders={orders}
                  setRecharged={updateRech}
                  setRecharged2={updateRech2}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/registration"
            exact
            render={() => (
              <UserRegistration users={users} userRole={userRole} setAuthAlert={setAuthAlert} setRecharged={updateRech} setRecharged1={updateRech1} />
            )}
          />
          <Route
            path="/"
            render={() => (
              <Frontpage
                logout={doLogOut}
                logged={logged}
                userRole={userRole}
                userName={userName}
                userMail={userMail}
              />
            )}
          />
        </Switch>
      </div>
    </Router >
  );
}

export default App;
