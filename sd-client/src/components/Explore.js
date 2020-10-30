import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import { withStyles } from "@material-ui/core";
import Header from "./Header";
import Chats from "./Chats";
import ChatScreen from "./Chat";
import TinderCards from "./Cards";
import SwipeButtons from "./Swipe";

const styles = theme => ({});

class Explore extends Component {
  render() {
    return (
      <div className="explore">
        <Router>
          <Switch>
            <Route path="/chat/:person">
              <Header backButton="/chat" />
              <Chat />
            </Route>
            <Route path="/chat">
              <Header backButton="/" />
              <Chats />
            </Route>
            <Route path="/">
              <Header />
              <Cards />
              <Swipe />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default withStyles(styles)(Explore);
