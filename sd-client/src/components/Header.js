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
import { CLEAR_NOTIFICATION, ADD_NOTIFICATION } from "../redux/types";
import styles from "../styles";

const headerStyles = (theme) => ({
  ...styles.headerStyles,
});

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications= [],
       showNotifications: false,
    }
  }

  checkNotification = () => {
    axios
      .get("/notify", {
        params: { handle: localStorage.getItem("user") },
      })
      .then((response) => {
        this.setState({ notifications: response.data.notifications })
        store.dispatch({
          type: ADD_NOTIFICATION,
          length: response.data.length,
        });
      })
      .catch((err) => console.error(err));
  };

  componentDidMount() {
    this.checkNotification();
  }

  componentWillUnmount() {
    if (this.props.socket && this.props.socket.query.event === "chat")
      this.props.socket.disconnect();
  }

  showNotifications = () => {
    store.dispatch({ type: CLEAR_NOTIFICATION });
    this.setState({ showNotifications: true });
  };

  render() {
    const { backButton, history, classes, data } = this.props;

    return (
      <Container className={classes.header}>
        {this.props.profile ? null : backButton ? (
          <IconButton onClick={() => history.replace(backButton)}>
            <ArrowBackIos className={classes.headerIcon} fontSize="large" />
          </IconButton>
        ) : (
          <Link to="/profile">
            <IconButton>
              <PermIdentity className={classes.headerIcon} fontSize="large" />
            </IconButton>
          </Link>
        )}
        <Link to="/">
          <CardMedia
            className={classes.headerLogo}
            image="/tinderify.png"
            title="logo"
          />
        </Link>
        <IconButton onClick={this.showNotifications}>
          <Badge badgeContent={data.notifications} color="secondary">
            <NotificationsNone
              className={classes.headerIcon}
              fontSize="large"
            />
          </Badge>
        </IconButton>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps)(
  withRouter(withStyles(headerStyles)(Header))
);
