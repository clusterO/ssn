import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withStyles } from "@material-ui/core";
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
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:8888";

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

    await fetch("/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "content-type": "application/json",
      },
    });
  };

  componentDidMount() {
    //Realtime stream using Pusher
    let pusher = new Pusher("5e53d307e778b90b4668", { cluster: "eu" });

    pusher.connection.bind("connected", function () {
      axios.defaults.headers.common["X-Socket-Id"] =
        pusher.connection.socket_id;
    });

    pusher.subscribe("notifications").bind("someone_interested", () => {
      store.dispatch({ type: ADD_NOTIFICATION });
    });
  }

  streamChange = () => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("notificationStream", data => {
      console.log(data);
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
              <Swipe streamChange={this.streamChange} />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default withStyles(styles)(Explore);
