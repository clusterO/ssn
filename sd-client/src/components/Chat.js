import React, { Component } from "react";
import {
  withStyles,
  Avatar,
  IconButton,
  Container,
  Typography,
  TextField,
  Tooltip,
  Box,
  LinearProgress,
  Button,
} from "@material-ui/core";
import { CallReceived } from "@material-ui/icons";
import { Alert, AlertTitle } from "@material-ui/lab";
import axios from "axios";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import * as io from "socket.io-client";

import styles from "../styles";
import Header from "./Header";
import Reactions from "./Reactions";

const chatStyles = () => ({
  "@global": {
    "*::-webkit-scrollbar": {
      width: "0.4em",
      display: "none",
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "1px solid slategrey",
    },
  },
  colorPrimary: {
    background: "green",
  },
  ...styles.chatStyles,
});

export class Chat extends Component {
  constructor(props) {
    super(props);
    this.socket = null;
    this.messagesEndRef = React.createRef();
    this.contact = this.props.match.params.person;
    this.state = {
      input: "",
      uri: "",
      messages: [],
      alert: false,
      call: false,
      wait: false,
      song: "",
    };
  }

  componentDidMount() {
    this.socket = io("ws://spotidate.herokuapp.com", {
      query: {
        handle: localStorage.getItem("user"),
        event: "chat",
        contact: this.contact,
      },
    });

    this.socket.on("messaging", (data) => {
      this.setState({
        messages: [
          ...this.state.messages,
          {
            content: data.content,
            from: data.handle,
          },
        ],
      });
    });

    this.socket.on("calling", (data) => {
      this.setState({ call: true, song: data.song });
    });

    this.socket.on("play", () => {
      this.setState({ wait: false });
      this.playCurrentSong();
    });

    this.socket.on("reject", () => {
      this.setState({ wait: false });
    });

    this.getMessages();
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  getMessages = () => {
    axios
      .get("/chat", {
        params: {
          handle: localStorage.getItem("user"),
          from: this.contact,
        },
      })
      .then((body) => {
        this.setState({ messages: body.data });
      })
      .catch((err) => console.error(err));
  };

  handleSend = (e) => {
    e.preventDefault();

    if (this.state.input && this.state.input.trim() !== "") {
      this.setState({
        messages: [
          ...this.state.messages,
          { content: this.state.input, uri: this.state.uri },
        ],
        input: "",
      });

      this.state.input
        ? axios
            .post("/send", {
              content: this.state.input,
              from: localStorage.getItem("user"),
              to: this.contact,
            })
            .catch((err) => console.error(err))
        : axios
            .post("/send", {
              uri: this.state.messages[this.state.messages.length - 1].uri
                ? this.state.messages[this.state.messages.length - 1].uri
                : "",
              content: this.state.messages[this.state.messages.length - 1]
                .content,
              from: localStorage.getItem("user"),
              to: this.contact,
            })
            .catch((err) => console.error(err));
    }
  };

  handleChange = (e) => {
    this.setState({ input: e.target.value });
  };

  onKeyPress = (e) => {
    let event = new Event("click");
    if (e.charCode === 13) this.handleSend(event);
  };

  stopWaiting = () => {
    this.setState({ wait: false });
  };

  requestRejected = () => {
    this.setState({ call: false });
    this.socket.emit("request", {
      handle: localStorage.getItem("user"),
      contact: this.contact,
      action: "reject",
    });
  };

  requestAccepted = () => {
    this.setState({ call: false });
    this.socket.emit("request", {
      handle: localStorage.getItem("user"),
      contact: this.contact,
      action: "accept",
    });
    this.playCurrentSong();
  };

  handleShare = () => {
    if (!axios.defaults.headers.common["authorization"])
      axios.defaults.headers.common["authorization"] = localStorage.getItem(
        "accessToken"
      );

    axios
      .get("/current")
      .then((body) => {
        if (body.data) {
          this.setState({
            input: body.data.song,
            uri: body.data.uri,
          });
        }

        let event = new Event("click", { bubbles: true, cancelable: false });
        this.handleSend(event);
      })
      .catch((err) => console.error(err));
  };

  handleListening = () => {
    if (!axios.defaults.headers.common["authorization"])
      axios.defaults.headers.common["authorization"] = localStorage.getItem(
        "accessToken"
      );

    axios
      .get("/current")
      .then((response) => {
        this.setState({ song: response.data.song });

        axios
          .post("/request", {
            song: response.data.song,
            from: localStorage.getItem("user"),
            to: this.contact,
          })
          .then(() => {
            this.setState({ wait: true });
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  playCurrentSong = () => {
    axios
      .post("/play", { song: this.state.song })
      .then((body) => {
        if (
          body.data &&
          body.data.error &&
          body.data.error.reason === "PREMIUM_REQUIRED"
        ) {
          this.setState({ alert: true });
          setTimeout(() => this.setState({ alert: false }), 2000);
        }
      })
      .catch((err) => console.error(err));
  };

  render() {
    const { classes } = this.props;

    return (
      <>
        <div className={classes.head}>
          <Header backButton="/chat" socket={this.socket} />
        </div>

        <div className={classes.chatScreen}>
          <Typography className={classes.chatScreenTimestamp}>
            YOU MATCHED WITH {this.contact} ON
          </Typography>
          {this.state.messages
            .sort((a, b) => a.date - b.date)
            .map((message, index) =>
              message.from ? (
                <Container key={index} className={classes.chatScreenMessage}>
                  <Avatar
                    className={classes.chatScreenImage}
                    alt={message.from}
                    src={
                      message.image ||
                      "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
                    }
                  />
                  <Typography
                    variant="body1"
                    className={classes.chatScreenText}
                  >
                    {message.content}
                    {message.uri ? (
                      <a href={message.uri}>
                        <span role="img" aria-label="musical note">
                          {" "}
                          🎵
                        </span>{" "}
                        click to listen
                      </a>
                    ) : null}
                  </Typography>
                  <Reactions
                    to={this.contact}
                    id={message.id}
                    reaction={message.reaction}
                  />
                </Container>
              ) : (
                <Container key={index} className={classes.chatScreenMessage}>
                  <Typography
                    variant="body1"
                    className={classes.chatScreenTextUser}
                  >
                    {message.content}
                    {message.uri ? (
                      <a href={message.uri}>
                        <span role="img" aria-label="musical note">
                          {" "}
                          🎵
                        </span>{" "}
                        click to listen
                      </a>
                    ) : null}
                  </Typography>
                </Container>
              )
            )}
          {this.state.alert ? (
            <Alert severity="info">
              <AlertTitle>Info</AlertTitle>
              You need a premium profile — <strong>PREMIUM_REQUIRED</strong>
            </Alert>
          ) : null}

          {this.state.wait ? (
            <div>
              <LinearProgress color="secondary" />
              <Alert onClose={this.stopWaiting} icon={false} severity="warning">
                <AlertTitle>Requesting</AlertTitle>
                Listen together request sent
              </Alert>
            </div>
          ) : null}

          {this.state.call ? (
            <div>
              <LinearProgress className={classes.colorPrimary} />
              <Alert
                action={
                  <div>
                    <Button
                      onClick={this.requestAccepted}
                      color="inherit"
                      size="small"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={this.requestRejected}
                      color="inherit"
                      size="small"
                    >
                      Cancel
                    </Button>
                  </div>
                }
                icon={<CallReceived fontSize="inherit" />}
                severity="success"
              >
                <AlertTitle>Request</AlertTitle>
                {this.contact} asking you to listen together to —{" "}
                <strong>{this.state.song}</strong>
              </Alert>
            </div>
          ) : null}
          <div ref={this.messagesEndRef} />
        </div>

        <Container className={classes.chatScreenInput}>
          <TextField
            value={this.state.input}
            onChange={this.handleChange}
            className={classes.chatScreenInputField}
            type="text"
            placeholder="Type a message..."
            onKeyPress={this.onKeyPress}
          />
          <Tooltip title="Send" arrow>
            <IconButton
              onClick={this.handleSend}
              className={classes.chatScreenInputButton}
            >
              <Box className="fa fa-paper-plane" aria-hidden="true" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share currently playing" arrow>
            <IconButton
              onClick={this.handleShare}
              className={classes.chatScreenShare}
            >
              <Box className="fa fa-share" aria-hidden="true" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Listen together" arrow>
            <IconButton
              onClick={this.handleListening}
              className={classes.chatScreenListen}
            >
              <Box className="fa fa-music" aria-hidden="true" />
            </IconButton>
          </Tooltip>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps)(
  withRouter(withStyles(chatStyles)(Chat))
);
