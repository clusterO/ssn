import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Container,
  withStyles,
  IconButton,
  Badge,
  CardMedia,
} from "@material-ui/core";
import {
  PermIdentity,
  NotificationsNone,
  ArrowBackIos,
} from "@material-ui/icons";
import axios from "axios";
import { connect } from "react-redux";
import store from "../redux/store";
import { ADD_NOTIFICATION } from "../redux/types";

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
      .get("/notify", {
        params: { handle: this.props.data.user },
      })
      .then(response => {
        // Add number of notifications from response
        store.dispatch({ type: ADD_NOTIFICATION });
      });
  };

  componentDidMount() {
    // this.checkNotification();
  }

  render() {
    const { backButton, history, classes, data } = this.props;

    return (
      <Container className={classes.header}>
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
          <CardMedia
            className={classes.header_logo}
            image="/tinderify.png"
            title="logo"
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
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
});

export default connect(mapStateToProps)(withRouter(withStyles(styles)(Header)));
