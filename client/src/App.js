import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './Components/MyNavbar';
import Frontpage from './Components/Frontpage';
import Booking from './Components/Booking';
import Orders from './Components/Orders';
import { clientOrders } from './classes/ClientOrder';
import API from './API';
import EmployeePage from './Components/EmployeePage';
import UserRegistration from './Components/UserRegistration';
import { useState, useEffect, Row, Alert } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { LoginForm1 } from './Components/LoginForm';
//import ProductGallery from './Components/Gallery';
import ClientArea from './Components/ClientArea';
import FarmerArea from './Components/FarmerArea';
import FarmerProducts from './Components/FarmerProducts';
import FarmerOrderPreparation from './Components/FarmerOrderPreparation';

let r = [];

function App() {
  const [time, setTime] = useState({ date: '01-01-2021', hour: '10:00' });
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
              x.time
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
  console.log(time);
  /* local objects to be deleted once we have a backend */
  const imgNames = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'];

  function updateProps() {
    setUpdate(!update);
  }

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLogged(true);
      setMessage('');
      setUserid(`${user.id}`);
    } catch (err) {
      setMessage(`"${err}"`);
    }
  };

  const doLogOut = async () => {
    await API.logOut();

    setLogged(false);
  };
  return (
    <Router>
      <MyNavbar time={time} setTime={setTime} />
      <div className="container-fluid">
        <Switch>
          <Route
            path="/booking"
            render={() => (
              <Booking
                browsing={false}
                logged={logged}
                orders={orders}
                isEmployee={false}
                products={confirmedProducts}
                updateProps={updateProps}
                time={time}
                clientid={userid}
                setRecharged={updateRech}
              />
            )}
          />
          <Route
            path="/products-next-week"
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
              />
            )}
          />
          <Route
            path="/orders"
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
            render={() => (
              <Booking
                browsing={false}
                logged={logged}
                clients={clients}
                orders={orders}
                isEmployee={true}
                products={confirmedProducts}
                updateProps={updateProps}
                time={time}
              />
            )}
          />
          <Route
            path="/employee"
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
            path="/farmer"
            render={() => (
              <FarmerArea />
            )}
          />
          <Route
            path="/declare-availability"
            render={() => (
              <FarmerProducts />
            )}
          />
          <Route
            path="/order-preparation"
            render={() => (
              <FarmerOrderPreparation />
            )}
          />
          <Route
            path="/login"
            render={() => (
              <LoginForm1 login={doLogIn} logged={logged} clients={clients} />
            )}
          />
          <Route
            path="/client"
            render={() => (
              <ClientArea logout={doLogOut} clients={clients} clientid={userid} />
            )}
          />
          <Route
            path="/registration"
            render={() => (
              <UserRegistration clients={clients} setRecharged={updateRech1} />
            )}
          />
          <Route path="/" render={() => <Frontpage />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
