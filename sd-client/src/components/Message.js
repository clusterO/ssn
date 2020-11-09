import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, withStyles, Avatar, Typography } from "@material-ui/core";
import styles from "../styles";

const messageStyles = theme => ({
  ...styles.messageStyles,
});

export class Message extends Component {
  render() {
    const { classes, handle, message, image, timestamp } = this.props;
    return (
      <Link to={`/chat/${handle}`} className={classes.link}>
        <Container className={classes.chat}>
          <Avatar className={classes.chatImage} alt={handle} src={image} />
          <Container className={classes.chatDetails}>
            <Typography>{handle}</Typography>
            <Typography className={classes.message}>{message}</Typography>
          </Container>
          <Typography className={classes.chatTimestamp}>{timestamp}</Typography>
        </Container>
      </Link>
    );
  }
}

export default withStyles(messageStyles)(Message);
