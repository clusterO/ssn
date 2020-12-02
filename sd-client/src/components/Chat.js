import React, { Component } from "react";
import {
  withStyles,
  Avatar,
  IconButton,
  Popover,
  Container,
  Typography,
  TextField,
  Tooltip,
  Box,
} from "@material-ui/core";
import { InsertEmoticon } from "@material-ui/icons";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as io from "socket.io-client";
import styles from "../styles";
import Header from "./Header";
import Reactions from "./Reactions";

const chatStyles = (theme) => ({
  ...styles.chatStyles,
});

export class Chat extends Component {
  constructor(props) {
    super(props);
    this.contact = this.props.match.params.person;
    this.state = {
      anchorEl: null,
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
  }

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

      axios
        .post("/send", {
          content: this.state.input,
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

  handlePopoverOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handlePopoverClose = (event) => {
    this.setState({ anchorEl: null });
  };

  handleShare = () => {
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
    const open = Boolean(this.state.anchorEl);

    return (
      <>
        <Header backButton="/chat" />
        <Container
          onClick={this.handlePopoverClose}
          className={classes.chatScreen}
        >
          <Typography className={classes.chatScreenTimestamp}>
            YOU MATCHED WITH {this.contact} ON _
          </Typography>
          {
            // automatically scroll
            this.state.messages
              .sort((a, b) => a.date - b.date)
              .map((message, index) =>
                message.from ? (
                  <Container key={index} className={classes.chatScreenMessage}>
                    <Avatar
                      className={classes.chatScreen_image}
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
                    <IconButton
                      disableRipple
                      variant="link"
                      aria-owns={open ? "mouse-over-popover" : undefined}
                      aria-haspopup="true"
                      onMouseEnter={this.handlePopoverOpen}
                    >
                      <InsertEmoticon />
                    </IconButton>
                    <Popover
                      id="mouse-over-popover"
                      className={classes.popover}
                      classes={{
                        paper: classes.paper,
                      }}
                      open={open}
                      anchorEl={this.state.anchorEl}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      onClose={this.handlePopoverClose}
                    >
                      <Reactions
                        from={localStorage.getItem("user")}
                        to={this.contact}
                        messageId={message.id}
                      />
                    </Popover>
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
              )
          }
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
