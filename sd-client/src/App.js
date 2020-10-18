import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import axios from "axios";
import Login from "./Login";
import Profile from "./Profile";
import Navbar from "./Navbar";

axios.defaults.baseURL = "http://localhost:8888/";

export class App extends Component {
  render() {
    return (
      <Router>
        <Navbar />
        <div className="container">
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/profile" component={Profile} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
