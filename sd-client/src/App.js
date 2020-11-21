import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import { Provider } from "react-redux";
import store from "./redux/store";

import Contacts from "./components/Contacts";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Explore from "./components/Explore";
import Navbar from "./components/Navbar";
import Karaoke from "./components/Karaoke";

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
            <Route exact path="/karaoke" component={Karaoke} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
