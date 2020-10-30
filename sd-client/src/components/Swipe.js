import React, { Component } from "react";
import { withStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {
  ReplayIcon,
  CloseIcon,
  StarRateIcon,
  FavoriteIcon,
  FlashOnIcon,
} from "@material-ui/icons";

const styles = theme => ({
  swipeButtons: {
    position: "fixed",
    bottom: "10vh",
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
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
          <ReplayIcon fontSize="large" />
        </IconButton>
        <IconButton className={classes.swipeButtons_left}>
          <CloseIcon fontSize="large" />
        </IconButton>
        <IconButton className={classes.swipeButtons_star}>
          <StarRateIcon fontSize="large" />
        </IconButton>
        <IconButton className={classes.swipeButtons_right}>
          <FavoriteIcon fontSize="large" />
        </IconButton>
        <IconButton className={classes.swipeButtons_lightning}>
          <FlashOnIcon fontSize="large" />
        </IconButton>
      </div>
    );
  }
}

export default withStyles(styles)(Swipe);
