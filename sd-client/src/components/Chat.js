import React, { Component } from "react";
import { withStyles, Avatar } from "@material-ui/core";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

const styles = theme => ({
  chatScreen_message: {
    display: "flex",
    alignItems: "center",
    padding: "20px",
  },
  chatScreen_text: {
    marginLeft: "10px",
    backgroundColor: "lightgray",
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
    backgroundColor: "#29b3cd",
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
});

export class Chat extends Component {
  constructor(props) {
    super(props);
    this.contact = this.props.match.params.person;
    this.state = {
      input: "",
      messages: [],
    };
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
    if (this.state.input) {
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

    this.setState({ input: "" });
  };

  handleChange = e => {
    this.setState({ input: e.target.value });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.chatScreen}>
        <p className={classes.chatScreen_timestamp}>
          YOU MATCHED WITH {this.contact} ON _
        </p>
        {this.state.messages.map(message =>
          message.from ? (
            <div className={classes.chatScreen_message}>
              <Avatar
                className={classes.chatScreen_image}
                alt={message.from}
                src={message.image}
              />
              <p className={classes.chatScreen_text}>{message.message}</p>
            </div>
          ) : (
            <div className={classes.chatScreen_message}>
              <p className={classes.chatScreen_textUser}>{message.message}</p>
            </div>
          )
        )}
        <form className={classes.chatScreen_input}>
          <input
            valeu={this.state.input}
            onChange={this.handleChange}
            className={classes.chatScreen_inputField}
            type="text"
            placeholder="Type a message..."
          />
          <button
            onClick={this.handleSend}
            type="submit"
            className={classes.chatScreen_inputButton}
          >
            SEND
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
});

export default connect(mapStateToProps)(withRouter(withStyles(styles)(Chat)));
