import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, withStyles, Avatar, Typography } from "@material-ui/core";

const styles = theme => ({
  chat: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px",
    height: "70px",
    borderBottom: "1px solid #fafafa",
  },
  link: {
    textDecoration: "none",
    color: "blue",
    "&:hover": {
      textDecoration: "none",
      color: "purple",
    },
  },
  chat_details: {
    flex: 1,
  },
  message: {
    color: "black",
    fontWeight: "bold",
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
      <Link to={`/chat/${handle}`} className={classes.link}>
        <Container className={classes.chat}>
          <Avatar className={classes.chat_image} alt={handle} src={image} />
          <Container className={classes.chat_details}>
            <Typography>{handle}</Typography>
            <Typography className={classes.message}>{message}</Typography>
          </Container>
          <Typography className={classes.chat_timestamp}>
            {timestamp}
          </Typography>
        </Container>
      </Link>
    );
  }
}

export default withStyles(styles)(Message);
