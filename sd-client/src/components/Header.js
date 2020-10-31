import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles, IconButton } from "@material-ui/core";
import { Person, Forum, ArrowBackIos } from "@material-ui/icons";

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
          <IconButton>
            <Person className={classes.header_icon} fontSize="large" />
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
            <Forum className={classes.header_icon} fontSize="large" />
          </IconButton>
        </Link>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
