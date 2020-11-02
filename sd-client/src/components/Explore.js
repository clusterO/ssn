import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withStyles } from "@material-ui/core";
import Header from "./Header";
import Contacts from "./Contacts";
import Chat from "./Chat";
import Cards from "./Cards";
import Swipe from "./Swipe";

const styles = theme => ({});

class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handle: "",
    };
  }
  render() {
    const handle = this.state.handle;
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
              <Contacts />
            </Route>
            <Route path="/">
              <Header />
              <Cards handle={handle} />
              <Swipe handle={handle} />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default withStyles(styles)(Explore);
