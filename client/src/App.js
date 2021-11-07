import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from './Components/MyNavbar';
import Frontpage from './Components/Frontpage';
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {

  const [time, setTime] = useState({ day: "monday", hour: "10" });

  console.log(time);

  return (
    <Router>
      <MyNavbar time={time} setTime={setTime} />
      <Switch>
        <Route path="/" render={() => (
          <Frontpage />
        )} />
      </Switch>
    </Router>
  );
}

export default App;
