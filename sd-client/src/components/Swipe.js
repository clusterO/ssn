import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles, IconButton } from "@material-ui/core";
import { Replay, Close, StarRate, Favorite, Forum } from "@material-ui/icons";
import { connect } from "react-redux";
import axios from "axios";

const styles = theme => ({
  swipeButtons: {
    position: "fixed",
    bottom: "10vh",
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    margin: "auto auto",
  },
  MuiIconButton_root: {
    backgroundColor: "white",
    boxShadow: "0px 10px 53px 0px rgba(0, 0, 0, 0.3) !important",
  },
  swipeButtons_repeat: {
    padding: "3vw !important",
    color: "#f5b748 !important",
  },
  swipeButtons_left: {
    padding: "3vw !important",
    color: "#ec5e6f !important",
  },
  swipeButtons_star: {
    padding: "3vw !important",
    color: "#62b4f9 !important",
  },
  swipeButtons_right: {
    padding: "3vw !important",
    color: "#76e2b3 !important",
  },
  messages: {
    padding: "3vw !important",
    color: "#915dd1 !important",
  },
});

export class Swipe extends Component {
  match = handle => {
    const body = { handle: "jane.m" };
    axios.post("http://localhost:8888/list", body).then(data => {});
  };

  render() {
    const { classes, data } = this.props;
    return (
      <div className={classes.swipeButtons}>
        <IconButton className={classes.swipeButtons_repeat}>
          <Replay fontSize="large" />
        </IconButton>
        <IconButton className={classes.swipeButtons_left}>
          <Close fontSize="large" />
        </IconButton>
        <IconButton
          onClick={() => this.match(data.handle)}
          className={classes.swipeButtons_right}
        >
          <Favorite fontSize="large" />
        </IconButton>
        <IconButton className={classes.swipeButtons_star}>
          <StarRate fontSize="large" />
        </IconButton>
        <Link to="/chat">
          <IconButton className={classes.messages}>
            <Forum fontSize="large" />
          </IconButton>
        </Link>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
});

export default connect(mapStateToProps)(withStyles(styles)(Swipe));
