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
import { useState, useEffect, Row, Alert } from 'react';
import { Redirect, BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { LoginForm1 } from './Components/LoginForm';
import ClientArea from './Components/ClientArea';
import FarmerArea from './Components/FarmerArea';
import FarmerProducts from './Components/FarmerProducts';
import FarmerOrderPreparation from './Components/FarmerOrderPreparation';
import FarmerOrderConfirmation from './Components/FarmerOrderConfirmation';

let r = [];

function App() {
  const [time, setTime] = useState({ date: '11-30-2021', hour: '10:00' });
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
  const [userRole, setUserRole] = useState();

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
      setUserid(`${user.id}`);
      setUserRole(`${user.role}`);
      console.log(user.role);
      if (user.role === 'client') {
        return (
          <Redirect to="/client" />
        );
      }
      else if (user.role === 'employee') {
        return (
          <Redirect to="/employee" />
        );
      }
      else if (user.role === 'warehouse-employee') {
        return (
          <Redirect to="/warehouse-employee" />
        );
      }
      else if (user.role === 'warehouse-manager') {
        return (
          <Redirect to="/warehouse-manager" />
        );
      }
    } catch (err) {
      setMessage(`"${err}"`);
    }
  };

  const doLogOut = async () => {
    await API.logOut();

    setLogged(false);
    setUserRole('');
    setUserid(-1);

    return(
      <Redirect to="/" />
    )

  };

  return (
    <Router>
      <MyNavbar time={time} loggedIn={logged} userRole={userRole} setTime={setTime} />
      <div className="container-fluid">
        <Switch>
          <Route
            path="/booking"
            exact
            render={() => (
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
            )}
          />
          <Route
            path="/products-next-week"
            exact
            render={() => (
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
            )}
          />
          <Route
            path="/orders"
            exact
            render={() => (
              <Orders
                orders={orders}
                clientid={userid}
                setRecharged={updateRech}
              />
            )}
          />
          <Route
            path="/staff-booking"
            exact
            render={() => (
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
            )}
          />
          <Route
            path="/employee"
            exact
            render={() => (
              <EmployeePage
                orders={orders}
                clients={clients}
                methods={methods}
                addTr={addTransaction}
                topUp={topUpBalance}
                setRecharged={updateRech}
                logout={doLogOut}
              />
            )}
          />
          <Route
            path="/warehouse-employee"
            exact
            render={() => (
              <WarehousePage
                userRole="warehouse-employee"
                orders={orders}
                providers={providers}
                methods={methods}
                setRecharged={updateRech}
                logout={doLogOut}
              />
            )}
          />
          <Route
            path="/warehouse-manager"
            exact
            render={() => (
              <WarehousePage
                userRole="warehouse-manager"
                orders={orders}
                providers={providers}
                methods={methods}
                logout={doLogOut}
              />
            )}
          />
          <Route
            path="/farmer"
            exact
            render={() => (
              <FarmerArea time={time} />
            )}
          />
          <Route
            path="/declare-availability"
            exact
            render={() => (
              <FarmerProducts time={time} />
            )}
          />
          <Route
            path="/order-preparation"
            exact
            render={() => (
              <FarmerOrderPreparation time={time} />
            )}
          />

          <Route
            path="/order-confirmation-farmer"
            exact
            render={() => (
              <FarmerOrderConfirmation />
            )}
          />
          <Route
            path="/login"
            exact
            render={() => (
              <LoginForm1 login={doLogIn} logged={logged} userID={userid} userRole={userRole} clients={clients} users={users} />
            )}
          />
          <Route
            path="/client"
            exact
            render={() => (
              <ClientArea logout={doLogOut} clients={clients} clientid={userid} />
            )}
          />
          <Route
            path="/registration"
            exact
            render={() => (
              <UserRegistration clients={clients} setRecharged={updateRech1} />
            )}
          />
          <Route path="/" exact
            render={() => <Frontpage />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
