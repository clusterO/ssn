import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import Login from "./components/Login";
import Profile from "./components/Profile";
import Explore from "./components/Explore";
import Navbar from "./components/Navbar";

export class App extends Component {
  render() {
    return (
      <Provider store={store}>
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
      </Provider>
    );
  }
}

export default App;
