import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import { Provider } from "react-redux";
import store from "./redux/store";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";

import Contacts from "./components/Contacts";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Explore from "./components/Explore";
import Karaoke from "./components/Karaoke";

// https://spotidate.herokuapp.com
axios.defaults.baseURL = "http://localhost:8888";

const theme = createMuiTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "1em",
      },
    },
  },
});

export class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
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
      </MuiThemeProvider>
    );
  }
}

export default App;
