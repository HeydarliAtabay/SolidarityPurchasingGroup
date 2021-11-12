import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './Components/MyNavbar';
import Frontpage from './Components/Frontpage';
import Booking from './Components/Booking';
import { client, clientOrders } from './Client';
import API from './API';
import EmployeePage from './EmployeePage';
import ClientPage from './ClientPage';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import ProductGallery from './Components/Gallery';

let p = [];
let r = [];

function App() {
  const [time, setTime] = useState({ day: 'monday', hour: '10' });
  const [recharged, setRecharged] = useState(true);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  const updateRech = (x) => {
    setRecharged(x);
  };
  /* USEFFECT clients */
  useEffect(() => {
    const getClients = async () => {
      await API.getAllClients().then((data) => {
        data.forEach((x) => {
          p.push(new client(x.client_id, x.budget));
        });
        let m = [...p];
        p = [];
        setClients(m);
      });
    };
    getClients();
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
          console.log(res);
          setProducts(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAllProducts();
  }, []);

  console.log(time);
  /* local objects to be deleted once we have a backend */
  const imgNames = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'];

  const productsArray = [
    {
      id: 1,
      name: 'carrots',
      description: 'carotine deliziose',
      category: 'Vegetables',
      price: 2.0,
      unit: 'kg',
      quantity: 0,
      expiryDate: '10 giorni',
      providerId: 12,
      productProviderName: 'cascina Torchiano',
    },
    {
      id: 2,
      name: 'eggplants',
      description: 'pomodori molto rossi',
      category: 'Vegetables',
      price: 1.05,
      unit: 'kg',
      quantity: 304,
      expiryDate: '1 mese',
      providerId: 1,
      productPoviderName: ' LIDL',
    },
    {
      id: 3,
      name: 'tomatoes',
      description: ' melanzane scadute ma ancora buone',
      category: 'Vegetables',
      price: 0.35,
      unit: 'kg',
      quantity: 1594,
      expiryDate: ' tre giorni fa',
      providerId: 666,
      productProviderName: 'EATALY',
    },
    {
      id: 4,
      name: 'fennels',
      description: 'zucchine fresche',
      category: 'Fruits',
      price: 0.54,
      unit: 'kg',
      quantity: 24,
      expiryDate: ' 5 giorni',
      providerId: 124,
      productProviderName: ' orto del nonno',
    },
    {
      id: 5,
      name: 'zucchinis',
      description:
        'Zucchini, like all squash, has its ancestry in the Americas, specifically Mesoamerica. However, the varieties of green, cylindrical squash harvested immature and typically called zucchini were cultivated in northern Italy, as much as three centuries after the introduction of cucurbits from the Americas. It appears that this occurred in the second half of the 19th century, although the first description of the variety under the name zucchini occurs in a work published in Milan in 1901.[9] Early varieties usually appended the names of nearby cities in their names',
      category: 'Fruits',
      price: 0.54,
      unit: 'kg',
      quantity: 24,
      expiryDate: ' 5 giorni',
      providerId: 124,
      productProviderName: ' orto del nonno',
    },
    {
      id: 6,
      name: 'SPRITE',
      description: 'senza zuccheri',
      category: 'Drinks',
      price: 0.99,
      unit: 'kg',
      quantity: 2222,
      expiryDate: '',
      providerId: 25,
      productProviderName: 'POLITO',
    },
    {
      id: 6,
      name: 'COCA COLA',
      description: 'senza caffeina',
      category: 'Drinks',
      price: 0.99,
      unit: 'kg',
      quantity: 2222,
      expiryDate: '',
      providerId: 25,
      productProviderName: 'POLITO',
    },
    {
      id: 6,
      name: 'CODEINA',
      description: 'senza sciroppo',
      category: 'Drinks',
      price: 0.99,
      unit: 'kg',
      quantity: 2222,
      expiryDate: '',
      providerId: 25,
      productProviderName: 'POLITO',
    },
  ];

  return (
    <Router>
      <MyNavbar time={time} setTime={setTime} />
      <Switch>
        <Route path="/booking" render={() => <Booking products={products} />} />
        <Route
          path="/employee"
          render={() => (
            <EmployeePage orders={orders} setRecharged={updateRech} />
          )}
        />
        <Route
          path="/client"
          render={() => <ClientPage clients={clients} clientid={1} />}
        />
        <Route
          path="/products"
          render={() => <ProductGallery products={productsArray} />}
        />
        <Route path="/" render={() => <Frontpage />} />
      </Switch>
    </Router>
  );
}

export default App;
