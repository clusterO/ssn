import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles, IconButton, Container } from "@material-ui/core";
import { Replay, Close, StarRate, Favorite, Forum } from "@material-ui/icons";
import { connect } from "react-redux";
import axios from "axios";
import styles from "../styles";

const swipeStyles = theme => ({
  ...styles.swipeStyles,
});

export class Swipe extends Component {
  match = handle => {
    const body = { handle: "jane.m" };
    axios.get("/match", { params: body }).then(data => {});
  };

  render() {
    const { classes, data } = this.props;
    return (
      <Container className={classes.swipeButtons}>
        <IconButton className={classes.swipeButtonsRepeat}>
          <Replay fontSize="large" />
        </IconButton>
        <IconButton className={classes.swipeButtonsLeft}>
          <Close fontSize="large" />
        </IconButton>
        <IconButton
          onClick={() => this.match(data.handle)}
          className={classes.swipeButtonsRight}
        >
          <Favorite fontSize="large" />
        </IconButton>
        <IconButton className={classes.swipeButtonsStar}>
          <StarRate fontSize="large" />
        </IconButton>
        <Link to="/chat">
          <IconButton className={classes.messages}>
            <Forum fontSize="large" />
          </IconButton>
        </Link>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
});

export default connect(mapStateToProps)(withStyles(swipeStyles)(Swipe));
