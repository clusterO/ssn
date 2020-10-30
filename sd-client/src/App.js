import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./components/Login";
import Profile from "./components/Profile";
import Explore from "./components/Explore";
import Navbar from "./components/Navbar";

export class App extends Component {
  render() {
    return (
      <Router>
        <Navbar />
        <div className="container">
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/explore" component={Explore} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
