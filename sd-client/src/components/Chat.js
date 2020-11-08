import React, { Component } from "react";
import {
  withStyles,
  Avatar,
  IconButton,
  Popover,
  Button,
  Container,
  Typography,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { InsertEmoticon } from "@material-ui/icons";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as io from "socket.io-client";

const styles = theme => ({
  chatScreenMessage: {
    display: "flex",
    alignItems: "center",
    padding: "20px",
  },
  chatScreenText: {
    marginLeft: "10px",
    backgroundColor: "#f887ff",
    padding: "15px",
    borderRadius: "20px",
  },
  chatScreenTimestamp: {
    textAlign: "center",
    color: "grey",
    padding: "20px",
  },
  chatScreenTextUser: {
    marginLeft: "auto",
    backgroundColor: "#321450",
    padding: "15px",
    borderRadius: "20px",
    color: "white",
  },
  chatScreenInput: {
    display: "flex",
    padding: "5px",
    position: "fixed",
    bottom: 0,
    width: "80%",
    marginBottom: "10px",
  },
  chatScreenInputField: {
    flex: 1,
    padding: "10px",
    border: "none",
  },
  chatScreenInputButton: {
    border: "none",
    marginRight: "5px",
    backgroundColor: "white",
    fontWeight: "bolder",
    color: "#fe3d71",
  },
  chatScreenShare: {
    border: "none",
    marginRight: "5px",
    backgroundColor: "white",
    fontWeight: "bolder",
    color: "#1afe49",
  },
  chatScreenListen: {
    border: "none",
    marginRight: "5px",
    backgroundColor: "white",
    fontWeight: "bolder",
    color: "#ff6e27",
  },
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing(1),
    borderRadius: "20px",
  },
  smile: {},
  reaction: {
    padding: "0 0.25rem 0 0.25rem",
    fontSize: "1rem",
    transition: "O.25s",
    "&:hover": {
      textDecoration: "none",
      fontSize: "1.5rem",
    },
  },
});

export class Chat extends Component {
  constructor(props) {
    super(props);
    this.contact = this.props.match.params.person;
    this.state = {
      anchorEl: null,
      input: "",
      messages: [],
    };

    //Listen to incoming messages
    const url = "ws://localhost:8888";
    const socket = io(url, { query: `handle=${"_"}` });

    socket.on("newMessage", data => {
      this.setState({
        messages: [...this.state.messages, { message: data.message }],
      });
    });
  }

  componentDidMount() {
    this.getMessages();
  }

  getMessages = () => {
    axios
      .get("/chat", {
        params: {
          //replace handle with this.props.data.user
          handle: "jane.m",
          from: this.contact,
        },
      })
      .then(body => {
        this.setState({ messages: body.data });
      });
  };

  handleSend = e => {
    e.preventDefault();
    if (this.state.input && this.state.input.trim() !== "") {
      this.setState({
        messages: [...this.state.messages, { message: this.state.input }],
        input: "",
      });

      axios.post("/send", {
        content: this.state.input,
        from: this.props.data.user,
        to: this.contact,
      });
    }
  };

  handleChange = e => {
    this.setState({ input: e.target.value });
  };

  handlePopoverOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handlePopoverClose = event => {
    this.setState({ anchorEl: null });
  };

  react = reaction => {
    console.log("Hello world");
  };

  handleShare = () => {
    axios.get("/current").then(body => {
      let message = Object.assign({}, this.state.messages[0]);
      message.message = `_ shares this song with you ${body.song} `;

      this.setState({
        messages: [...this.state.messages, { message: message }],
      });

      //Add message to the conversation
    });
  };

  handleListening = () => {
    console.log("Listen");
  };

  render() {
    const { classes } = this.props;
    const reactions = ["💗", "👏", "🌷", "🌶️", "🥰"];
    const open = Boolean(this.state.anchorEl);

    return (
      <Container
        onClick={this.handlePopoverClose}
        className={classes.chatScreen}
      >
        <Typography className={classes.chatScreenTimestamp}>
          YOU MATCHED WITH {this.contact} ON _
        </Typography>
        {this.state.messages.map((message, index) =>
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
              <Typography className={classes.chatScreenText}>
                {message.message}
              </Typography>
              <Container>
                <IconButton
                  className={classes.smile}
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
                  disableRestoreFocus
                >
                  {reactions.map((reaction, index) => (
                    <IconButton
                      variant="link"
                      className={classes.reaction}
                      key={index}
                      onClick={() => this.react(reaction)}
                    >
                      {reaction}
                    </IconButton>
                  ))}
                </Popover>
              </Container>
            </Container>
          ) : (
            <Container key={index} className={classes.chatScreenMessage}>
              <Typography className={classes.chatScreenTextUser}>
                {message.message}
              </Typography>
            </Container>
          )
        )}
        <Container className={classes.chatScreenInput}>
          <TextField
            value={this.state.input}
            onChange={this.handleChange}
            className={classes.chatScreenInputField}
            type="text"
            placeholder="Type a message..."
          />
          <Tooltip title="Send" arrow>
            <IconButton
              onClick={this.handleSend}
              className={classes.chatScreenInputButton}
            >
              <i class="fa fa-paper-plane" aria-hidden="true"></i>
            </IconButton>
          </Tooltip>
          <Tooltip title="Share currently playing" arrow>
            <IconButton
              onClick={this.handleShare}
              className={classes.chatScreenShare}
            >
              <i class="fa fa-share" aria-hidden="true"></i>
            </IconButton>
          </Tooltip>
          <Tooltip title="Listen together" arrow>
            <IconButton
              onClick={this.handleListening}
              className={classes.chatScreenListen}
            >
              <i class="fa fa-music" aria-hidden="true"></i>
            </IconButton>
          </Tooltip>
        </Container>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
});

export default connect(mapStateToProps)(withRouter(withStyles(styles)(Chat)));
