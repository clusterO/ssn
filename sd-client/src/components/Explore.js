import React, { Component } from "react";
import { Container, withStyles, LinearProgress } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Header from "./Header";
import Cards from "./Cards";
import { urlBase64ToUint8Array } from "../utils/converter";
import axios from "axios";
import { connect } from "react-redux";

const publicVapidKey =
  "BKDmx4plzOXrRtpb7CHKW4huOEkckKCkNtfu50CkXeORnGSvC2L9bCg-o3vI2sL1kux90iUOdeTmAU2-1fIsTMM";

const exploreStyles = (theme) => ({
  progress: {
    marginTop: "10vh",
  },
});

class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: false,
    };
  }

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
    axios
      .get("/match", { params: { handle: localStorage.getItem("user") } })
      .then((response) => {
        // use cards from response
        this.setState({ cards: true });
      })
      .catch((err) => {});
  }

  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Header />
        {this.state.cards ? (
          <Cards />
        ) : (
          <div className={classes.progress}>
            <Alert variant="outlined" severity="info">
              processing matches — this may take a few seconds while the
              algorithm match your musical tastes with other users... please
              wait!
              <LinearProgress />
            </Alert>
          </div>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(exploreStyles)(Explore));
