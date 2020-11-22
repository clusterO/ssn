import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles, Avatar, Typography } from "@material-ui/core";
import styles from "../styles";

const messageStyles = theme => ({
  ...styles.messageStyles,
});

export class Message extends Component {
  render() {
    const { classes, handle, message, image, timestamp } = this.props;
    return (
      <Link to={`/chat/${handle}`} className={classes.link}>
        <div className={classes.chat}>
          <Avatar className={classes.chatImage} alt={handle} src={image} />
          <div className={classes.chatDetails}>
            <Typography variant="h6">{handle}</Typography>
            <Typography variant="body1" className={classes.message}>
              {message ? message : "new friend.. say hi!"}
            </Typography>
          </div>
          <Typography className={classes.chatTimestamp}>{timestamp}</Typography>
        </div>
      </Link>
    );
  }
}

export default withStyles(messageStyles)(Message);
