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
} from "@material-ui/core";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as io from "socket.io-client";
import styles from "../styles";
import Header from "./Header";
import Reactions from "./Reactions";

const chatStyles = (theme) => ({
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
  ...styles.chatStyles,
});

export class Chat extends Component {
  constructor(props) {
    super(props);
    this.messagesEndRef = React.createRef();
    this.contact = this.props.match.params.person;
    this.state = {
      input: "",
      uri: "",
      messages: [],
    };
  }

  componentDidMount() {
    const url = "ws://localhost:8888";
    const socket = io(url, { query: `handle=${"_"}` });

    // message should be received onetime (db watch messages change)
    socket.on("newMessage", (data) => {
      this.setState({
        messages: [
          ...this.state.messages,
          {
            content: data.fullDocument.messages[0].content,
            from: data.fullDocument.handle,
          },
        ],
      });
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

  // sender shouldn't receive message
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
    // send request to listen together
    // ... call waiting response & cancel button
    axios
      .post("/play", { song: "" })
      .then((body) => {
        if (
          body.data &&
          body.data.error &&
          body.data.error.reason === "PREMIUM_REQUIRED"
        )
          console.log("PREMIUM_REQUIRED");

        // send the song and play it in the other side
      })
      .catch((err) => console.error(err));
  };

  render() {
    const { classes } = this.props;

    return (
      <>
        <div className={classes.head}>
          <Header backButton="/chat" />
        </div>

        <div className={classes.chatScreen}>
          <Typography className={classes.chatScreenTimestamp}>
            YOU MATCHED WITH {this.contact} ON _
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
