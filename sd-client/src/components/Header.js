import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles, IconButton } from "@material-ui/core";
import { PersonIcon, ForumIcon, ArrowBackIosIcon } from "@material-ui/icons";

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

  header_icon: {
    padding: "20px",
  },
});

export class Header extends Component {
  render() {
    const { backButton, history, classes } = this.props;
    return (
      <div className={classes.header}>
        {backButton ? (
          <IconButton onClick={() => history.replace(backButton)}>
            <ArrowBackIosIcon
              className={classes.header_icon}
              fontSize="large"
            />
          </IconButton>
        ) : (
          <IconButton>
            <PersonIcon className={classes.header_icon} fontSize="large" />
          </IconButton>
        )}

        <Link to="/">
          <img
            className={classes.header_logo}
            src="https://1000logos.net/wp-content/uploads/2018/07/tinder-logo.png"
            alt="tinder logo"
          />
        </Link>
        <Link to="/chat">
          <IconButton>
            <ForumIcon className={classes.header_icon} fontSize="large" />
          </IconButton>
        </Link>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
