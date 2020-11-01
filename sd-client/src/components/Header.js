import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { withStyles, IconButton } from "@material-ui/core";
import {
  PermIdentity,
  NotificationsNone,
  ArrowBackIos,
} from "@material-ui/icons";

const styles = theme => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #f9f9f9",
    alignItems: "center",
  },
  header_logo: {
    height: "40px",
    objectFit: "contain",
  },
  header_icon: {},
});

export class Header extends Component {
  render() {
    const { backButton, history, classes } = this.props;

    return (
      <div className={classes.header}>
        {backButton ? (
          <IconButton onClick={() => history.replace(backButton)}>
            <ArrowBackIos className={classes.header_icon} fontSize="large" />
          </IconButton>
        ) : (
          <Link to="/profile">
            <IconButton>
              <PermIdentity className={classes.header_icon} fontSize="large" />
            </IconButton>
          </Link>
        )}

        <Link to="/">
          <img
            className={classes.header_logo}
            src="/tinderify.png"
            alt="tinderify logo"
          />
        </Link>
        <IconButton>
          <NotificationsNone className={classes.header_icon} fontSize="large" />
        </IconButton>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Header));
