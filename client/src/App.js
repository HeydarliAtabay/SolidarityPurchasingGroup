import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './Components/MyNavbar';
import Frontpage from './Components/Frontpage';
import Booking from './Components/Booking';
import {client,clientOrders} from './Client';
import API from './API';
import EmployeePage from './EmployeePage';
import ClientPage from './ClientPage';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import ProductGallery from './Components/Gallery';

 let p=[];
 let r=[];

function App() {
  const [time, setTime] = useState({ day: 'monday', hour: '10' });
  const [recharged, setRecharged]=useState(true);
  const [orders, setOrders]=useState([]);
  const [clients, setClients]=useState([]);
  
  const updateRech=(x)=>{setRecharged(x)};
  /* USEFFECT clients */
  useEffect(()=>{
    const getClients=async()=>{
      await API.getAllClients().then(data=>{
        data.forEach((x) => {
       p.push(new client(x.client_id,x.budget));
              });
        let m=[...p];
        p=[]; 
        setClients(m);
    })};
      getClients();
      },[]);


/* USEFFECT orders*/
useEffect(()=>{
  const pr=()=>{
  API.getAllOrders().then(data=>{
    data.forEach((x) => {
   r.push(new clientOrders(x.order_id,x.client_id,x.product_name,x.state));
          });
    let om=[...r];
     r=[];   
    setOrders(om);
    setRecharged(false);
  })};
  if(recharged)
  pr();
},[recharged]);

  
  
  
  console.log(time);

  const imgNames = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'];

  return (
    <Router>
      <MyNavbar time={time} setTime={setTime} />
      <Switch>
        <Route path="/booking" render={() => <Booking />} />
        <Route path="/employee" render={() => (
          <EmployeePage orders={orders} setRecharged={updateRech} />
        )} />
         <Route path="/client" render={() => (
          <ClientPage clients={clients} clientid={1} />
        )} />
        <Route path="/" render={() => <Frontpage />} />
      </Switch>
      <Switch>
        <Route
          path="/products"
          render={() => <ProductGallery imgN={imgNames} />}
        />
      </Switch>
    </Router>
  );
}

export default App;
