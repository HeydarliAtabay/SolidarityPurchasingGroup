import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './Components/MyNavbar';
import Frontpage from './Components/Frontpage';
import Booking from './Components/Booking';
import Orders from './Components/Orders';
import { clientOrders } from './classes/ClientOrder';
import API from './API';
import EmployeePage from './Components/EmployeePage';
import WarehousePage from './Components/WarehousePage';
import UserRegistration from './Components/UserRegistration';
import { useState, useEffect } from 'react';
import { Container, Alert, Row, Button } from 'react-bootstrap';
import {
  Redirect,
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
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

let r = [];

function App() {
  const [time, setTime] = useState({
    date: dayjs().format('MM-DD-YYYY'),
    hour: dayjs().format('HH:mm'),
  });
  const [recharged, setRecharged] = useState(true);
  const [recharged1, setRecharged1] = useState(true);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [confirmedProducts, setConfirmedProducts] = useState([]);
  const [expectedProducts, setExpectedProducts] = useState([]);
  const [update, setUpdate] = useState(false); //used when an order is confirmed in order to update the quantity
  const [methods, setMethods] = useState([]);
  const [message, setMessage] = useState('');
  const [userid, setUserid] = useState();
  const [logged, setLogged] = useState(false);
  const [providers, setProviders] = useState();
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [userMail, setUserMail] = useState('');
  const [userName, setUserName] = useState('');

  const updateRech = (x) => {
    setRecharged(x);
  };
  const updateRech1 = (x) => {
    setRecharged1(x);
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
     let dayOfWeek= dayjs(time.date).day()
     if((dayOfWeek===6) && (time.hour==="09:00")){
      const SendNotification = async () => {
        await API.sendTelegramNotificationOnSaturday()
          .then((res) => {
            console.log("telegram message was sent to group")
          })
          .catch((err) => {
            console.log(err);
          });
      };
      SendNotification()
     }

     if(time.hour==="10:00"){
      const SendNotificationAboutInsufficientBalance = async () => {
        await API.sendTelegramNotificationAboutInsufficientBalanceEveryDayAt10()
          .then((res) => {
            console.log("telegram message was sent to the user")
          })
          .catch((err) => {
            console.log(err);
          });
      };
      SendNotificationAboutInsufficientBalance()
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

      setUserid(id);
      setUserRole(user.role);
      setUserMail(user.username);
      setUserName(user.name);

      if (user.role === 'client') {
        return <Redirect to="/client" />;
      } else if (user.role === 'employee') {
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
      setMessage(`"${err}"`);
    }
  };

  const doLogOut = async () => {
    await API.logOut();

    setLogged(false);
    setUserRole('');
    setUserMail('');
    setUserName('');
    setUserid(-1);

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
      />
      {message !== '' &&
        (<Container className="p-2 m-2">
          <Row className="justify-content-md-center">
            <Alert
              variant="danger"
              style={{
                fontSize: 25,
              }}
              onClose={() => setMessage('')}
              dismissible
            >
              {message}
            </Alert>
          </Row>
        </Container>
        )
      }

      <div className="container-fluid w-100">
        <Switch>
          <Route
            path="/booking"
            exact
            render={() =>
              logged ? (
                <Booking
                  browsing={false}
                  logged={logged}
                  orders={orders}
                  isEmployee={false}
                  products={confirmedProducts}
                  clients={clients}
                  updateProps={updateProps}
                  time={time}
                  clientid={userid}
                  setRecharged={updateRech}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/products-next-week"
            exact
            render={() =>
              logged ? (
                <Booking
                  browsing={true}
                  logged={logged}
                  isEmployee={false}
                  products={expectedProducts}
                  updateProps={updateProps}
                  time={time}
                  clientid={userid}
                  setRecharged={updateRech}
                  clients={clients}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/orders"
            exact
            render={() =>
              logged ? (
                <Orders
                  orders={orders}
                  clientid={userid}
                  setRecharged={updateRech}
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
                  browsing={false}
                  logged={logged}
                  clients={clients}
                  orders={orders}
                  isEmployee={true}
                  clientid={userid}
                  products={confirmedProducts}
                  setRecharged={updateRech}
                  updateProps={updateProps}
                  time={time}
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
                  mail={userMail}
                  addTr={addTransaction}
                  topUp={topUpBalance}
                  setRecharged={updateRech}
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
                <WarehousePage
                  userRole="warehouse-employee"
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
                <WarehousePage
                  userRole="warehouse-manager"
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
                <FarmerOrderPreparation time={time} />
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
                <FarmerOrderConfirmation time={time} />
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
              />
            )}
          />
          <Route
            path="/client"
            exact
            render={() =>
              logged ? (
                <ClientArea
                  logout={doLogOut}
                  userName={userName}
                  userMail={userMail}
                  clients={clients}
                  clientid={userid}
                  orders={orders}
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
              <UserRegistration users={users} setRecharged={updateRech1} />
            )}
          />
          <Route path="/" render={() => <Frontpage />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
