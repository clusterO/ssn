import React, { Component } from "react";
import { withStyles, Avatar } from "@material-ui/core";

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
    state: {
      input: "";
      messages: [];
    }
  }

  handleSend = e => {
    e.preventDefault();
    if (input) this.setState({ messages: [...messages, { message: input }] });

    this.setState({ input: "" });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.chatScreen}>
        <p className={classes.chatScreen_timestamp}>
          YOU MATCHED WITH ELLEN ON 10/08/20
        </p>
        {messages.map(message =>
          message.name ? (
            <div className={classes.chatScreen_message}>
              <Avatar
                className={classes.chatScreen_image}
                alt={message.name}
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
            valeu={input}
            onChange={e => setInput(e.target.value)}
            className={classes.chatScreen_inputField}
            type="text"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
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

export default withStyles(styles)(Chat);
