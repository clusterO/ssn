import React, { Component } from "react";
import { Container, withStyles } from "@material-ui/core";
import Header from "./Header";
import Cards from "./Cards";
import { urlBase64ToUint8Array } from "../utils/converter";
import axios from "axios";
import Pusher from "pusher-js";
import store from "../redux/store";
import { ADD_NOTIFICATION } from "../redux/types";
import * as io from "socket.io-client";
import { connect } from "react-redux";

const publicVapidKey =
  "BKDmx4plzOXrRtpb7CHKW4huOEkckKCkNtfu50CkXeORnGSvC2L9bCg-o3vI2sL1kux90iUOdeTmAU2-1fIsTMM";

const exploreStyles = theme => ({});

class Explore extends Component {
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
    const socket = io(url, { query: `handle=${localStorage.getItem("user")}` });

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
  // Dead_______________________________

  render() {
    return (
      <Container>
        <Header />
        <Cards />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(exploreStyles)(Explore));
