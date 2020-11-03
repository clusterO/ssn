import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { withStyles, IconButton, Badge } from "@material-ui/core";
import {
  PermIdentity,
  NotificationsNone,
  ArrowBackIos,
} from "@material-ui/icons";
import axios from "axios";
import { connect } from "react-redux";

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
  checkNotification = () => {
    axios
      .post("http://localhost:8888/notify", { handle: this.props.data.user })
      .then(response => {
        console.log(response.data.length);
      });
  };

  render() {
    const { backButton, history, classes, data } = this.props;
    this.checkNotification();

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
          <Badge badgeContent={data.notifications} color="secondary">
            <NotificationsNone
              className={classes.header_icon}
              fontSize="large"
            />
          </Badge>
        </IconButton>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
});

export default connect(mapStateToProps)(withRouter(withStyles(styles)(Header)));
