import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import axios from "axios";

import Contacts from "./components/Contacts";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Explore from "./components/Explore";
import Navbar from "./components/Navbar";

axios.defaults.baseURL = "http://localhost:8888";

export class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/explore" component={Explore} />
            <Route exact path="/chat/:person" component={Chat} />
            <Route exact path="/chat" component={Contacts} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
