import React, { Component } from "react";
import { withStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { Replay, Close, StarRate, Favorite, FlashOn } from "@material-ui/icons";

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
  swipeButtons_lightning: {
    padding: "3vw !important",
    color: "#915dd1 !important",
  },
});

export class Swipe extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.swipeButtons}>
        <IconButton className={classes.swipeButtons_repeat}>
          <Replay fontSize="large" />
        </IconButton>
        <IconButton className={classes.swipeButtons_left}>
          <Close fontSize="large" />
        </IconButton>
        <IconButton className={classes.swipeButtons_star}>
          <StarRate fontSize="large" />
        </IconButton>
        <IconButton className={classes.swipeButtons_right}>
          <Favorite fontSize="large" />
        </IconButton>
        <IconButton className={classes.swipeButtons_lightning}>
          <FlashOn fontSize="large" />
        </IconButton>
      </div>
    );
  }
}

export default withStyles(styles)(Swipe);
