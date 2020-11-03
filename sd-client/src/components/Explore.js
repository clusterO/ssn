import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withStyles } from "@material-ui/core";
import Header from "./Header";
import Contacts from "./Contacts";
import Chat from "./Chat";
import Cards from "./Cards";
import Swipe from "./Swipe";
import { urlBase64ToUint8Array } from "../utils/converter";

const publicVapidKey =
  "BKDmx4plzOXrRtpb7CHKW4huOEkckKCkNtfu50CkXeORnGSvC2L9bCg-o3vI2sL1kux90iUOdeTmAU2-1fIsTMM";

const styles = theme => ({});

class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handle: "",
    };
  }

  sendPushNotification = async () => {
    const subscription = await navigator.register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    await fetch("/list", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "content-type": "application/json",
      },
    });
  };

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
              <Contacts />
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
