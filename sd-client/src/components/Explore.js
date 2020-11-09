import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container, withStyles } from "@material-ui/core";
import Header from "./Header";
import Contacts from "./Contacts";
import Chat from "./Chat";
import Cards from "./Cards";
import Swipe from "./Swipe";
import { urlBase64ToUint8Array } from "../utils/converter";
import axios from "axios";
import Pusher from "pusher-js";
import store from "../redux/store";
import { ADD_NOTIFICATION } from "../redux/types";
import * as io from "socket.io-client";

const publicVapidKey =
  "BKDmx4plzOXrRtpb7CHKW4huOEkckKCkNtfu50CkXeORnGSvC2L9bCg-o3vI2sL1kux90iUOdeTmAU2-1fIsTMM";

const exploreStyles = theme => ({
  explore: {},
});

class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handle: "",
    };
  }

  // Push Notification With SW
  sendPushNotification = async () => {
    const register = await navigator.serviceWorker.register("/sw.js");
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    await fetch("/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "content-type": "application/json",
      },
    });
  };

  componentDidMount() {
    this.changeStream();
  }

  // SocketIo with MongoDb stream Change
  changeStream = () => {
    const url = "ws://localhost:8888";
    const socket = io(url, { query: `handle=${"_"}` });

    socket.on("notificationStream", data => {
      store.dispatch({ type: ADD_NOTIFICATION });
    });

    // socket.disconnect();
  };

  // Dead : Realtime stream using Pusher
  pusher = () => {
    let pusher = new Pusher("5e53d307e778b90b4668", { cluster: "eu" });

    pusher.connection.bind("connected", () => {
      axios.defaults.headers.common["X-Socket-Id"] =
        pusher.connection.socket_id;
    });

    pusher.subscribe("notifications").bind("someone_interested", () => {
      store.dispatch({ type: ADD_NOTIFICATION });
    });
  };
  // Dead

  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.explore}>
        <Router>
          <Switch>
            <Route path="/chat/:person">
              <Header backButton="/chat" />
              <Chat />
            </Route>
            <Route path="/chat">
              <Header backButton="/explore" />
              <Contacts />
            </Route>
            <Route path="/">
              <Header />
              <Cards />
              <Swipe />
            </Route>
          </Switch>
        </Router>
      </Container>
    );
  }
}

export default withStyles(exploreStyles)(Explore);
