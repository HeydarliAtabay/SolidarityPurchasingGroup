import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './Components/MyNavbar';
import Frontpage from './Components/Frontpage';
import Booking from './Components/Booking';
import { clientOrders } from './classes/ClientOrder';
import API from './API';
import EmployeePage from './Components/EmployeePage';
import ClientPage from './Components/ClientPage';
import UserRegistration from './Components/UserRegistration'
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import ProductGallery from './Components/Gallery';


let r = [];

function App() {
  const [time, setTime] = useState({ day: 'monday', hour: '10' });
  const [recharged, setRecharged] = useState(true);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [methods, setMethods] = useState([]);

  const updateRech = (x) => {
    setRecharged(x);
  };
  /* USEFFECT clients */
  useEffect(() => {
    API.getAllClients().then(newClients=>{
      setClients(newClients)
     })
  }, []);

  /* USEFFECT orders*/
  useEffect(() => {
    const pr = () => {
      API.getAllOrders().then((data) => {
        data.forEach((x) => {
          r.push(
            new clientOrders(x.order_id, x.client_id, x.product_name, x.state)
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
    const getAllProducts = async () => {
      await API.getAllProducts()
        .then((res) => {
          setProducts(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAllProducts();
  }, []);

  useEffect(() => {
      API.getAllPaymentMethods().then(newMethods=>{
        setMethods(newMethods)
       })
    }, []) 


    function addTransaction (tr)  {
      API.addTransaction(tr).then((err)=>{})
    }

    function topUpBalance (amount,client)  {
      API.increaseBalance(amount,client).then((err)=>{})
    }
  console.log(time);
  /* local objects to be deleted once we have a backend */
  const imgNames = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'];
  console.log(products);

  return (
    <Router>
      <MyNavbar time={time} setTime={setTime} />
      <Switch>
        <Route path="/booking" render={() => <Booking products={products} />} />
        <Route
          path="/employee"
          render={() => (
            <EmployeePage orders={orders} clients={clients} methods={methods} addTr={addTransaction} topUp={topUpBalance} setRecharged={updateRech} />
          )}
        />
        <Route
          path="/client"
          render={() => <ClientPage clients={clients} clientid={2} />}
        />
        <Route
          path="/registration"
          render={() => <UserRegistration />}
        />
        <Route
          path="/products"
          render={() => <ProductGallery products={products} />}
        />
        <Route path="/" render={() => <Frontpage />} />
      </Switch>
    </Router>
  );
}

export default App;

