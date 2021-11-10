import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from './Components/MyNavbar';
import Frontpage from './Components/Frontpage';
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import ProductGallery from './Components/Gallery'

function App() {

  const [time, setTime] = useState({ day: "monday", hour: "10" });

  console.log(time);

  const imgNames = ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg']

  return (
    <Router>
      <MyNavbar time={time} setTime={setTime} />
      <Switch>
        <Route path="/" render={() => (
          <Frontpage />
        )} />
      </Switch>
      <Switch>
        <Route path="/products" render={() => (
          <ProductGallery imgN ={imgNames}/>
        )} />
      </Switch>
    </Router>
  );
}

export default App;
