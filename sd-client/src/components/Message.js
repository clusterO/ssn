import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles, Avatar } from "@material-ui/core";

const styles = theme => ({
  chat: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px",
    height: "70px",
    borderBottom: "1px solid #fafafa",
  },
  a: {
    textDecoration: "none",
    color: "initial",
  },
  chat_details: {
    flex: 1,
  },
  p: {
    color: "gray",
  },
  chat_timestamp: {
    color: "lightgray",
  },
  chat_image: {
    marginRight: "20px",
  },
});

export class Message extends Component {
  render() {
    const { classes, handle, message, image, timestamp } = this.props;
    return (
      <Link to={`/chat/${handle}`}>
        <div className={classes.chat}>
          <Avatar className={classes.chat_image} alt={handle} src={image} />
          <div className={classes.chat_details}>
            <h2>{handle}</h2>
            <p>{message}</p>
          </div>
          <p className={classes.chat_timestamp}>{timestamp}</p>
        </div>
      </Link>
    );
  }
}

export default withStyles(styles)(Message);
