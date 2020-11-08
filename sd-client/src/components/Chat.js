import React, { Component } from "react";
import {
  withStyles,
  Avatar,
  IconButton,
  Popover,
  Button,
  Container,
  Typography,
  Input,
} from "@material-ui/core";
import { InsertEmoticon } from "@material-ui/icons";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as io from "socket.io-client";

const styles = theme => ({
  chatScreen_message: {
    display: "flex",
    alignItems: "center",
    padding: "20px",
  },
  chatScreen_text: {
    marginLeft: "10px",
    backgroundColor: "#f887ff",
    padding: "15px",
    borderRadius: "20px",
  },
  chatScreen_timestamp: {
    textAlign: "center",
    color: "grey",
    padding: "20px",
  },
  chatScreen_textUser: {
    marginLeft: "auto",
    backgroundColor: "#321450",
    padding: "15px",
    borderRadius: "20px",
    color: "white",
  },
  chatScreen_input: {
    display: "flex",
    padding: "5px",
    position: "fixed",
    bottom: 0,
    width: "100%",
    borderTop: "1px solid lightgray",
  },
  chatScreen_inputField: {
    flex: 1,
    padding: "10px",
    border: "none",
  },
  chatScreen_inputButton: {
    border: "none",
    marginRight: "10px",
    backgroundColor: "white",
    fontWeight: "bolder",
    color: "#fe3d71",
  },
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing(1),
    borderRadius: "20px",
  },
  reaction: {
    padding: "0 0.15rem 0 0.15rem",
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

  render() {
    const { classes } = this.props;
    const reactions = ["💗", "👏", "🌷", "🌶️", "🥰"];
    const open = Boolean(this.state.anchorEl);

    return (
      <Container
        onClick={this.handlePopoverClose}
        className={classes.chatScreen}
      >
        <Typography className={classes.chatScreen_timestamp}>
          YOU MATCHED WITH {this.contact} ON _
        </Typography>
        {this.state.messages.map((message, index) =>
          message.from ? (
            <Container key={index} className={classes.chatScreen_message}>
              <Avatar
                className={classes.chatScreen_image}
                alt={message.from}
                src={
                  message.image ||
                  "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
                }
              />
              <Typography className={classes.chatScreen_text}>
                {message.message}
              </Typography>
              <Container>
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
                  disableRestoreFocus
                >
                  {reactions.map((reaction, index) => (
                    <Button
                      className={classes.reaction}
                      key={index}
                      onClick={() => this.react(reaction)}
                    >
                      {reaction}
                    </Button>
                  ))}
                </Popover>
              </Container>
            </Container>
          ) : (
            <Container key={index} className={classes.chatScreen_message}>
              <Typography className={classes.chatScreen_textUser}>
                {message.message}
              </Typography>
            </Container>
          )
        )}
        <Container className={classes.chatScreen_input}>
          <Input
            value={this.state.input}
            onChange={this.handleChange}
            className={classes.chatScreen_inputField}
            type="text"
            placeholder="Type a message..."
          />
          <Button
            onClick={this.handleSend}
            type="submit"
            className={classes.chatScreen_inputButton}
          >
            SEND
          </Button>
        </Container>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
});

export default connect(mapStateToProps)(withRouter(withStyles(styles)(Chat)));
