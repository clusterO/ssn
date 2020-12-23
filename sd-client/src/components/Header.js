import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Container,
  withStyles,
  IconButton,
  Badge,
  CardMedia,
  Menu,
  MenuItem,
  Typography,
  Tooltip,
} from "@material-ui/core";
import {
  PermIdentity,
  NotificationsNone,
  ArrowBackIos,
  Favorite as FavoriteIcon,
} from "@material-ui/icons";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
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
      anchorEl: null,
    };
  }

  checkNotification = () => {
    axios
      .get("/notification", {
        params: { handle: localStorage.getItem("user") },
      })
      .then((response) => {
        store.dispatch({
          type: ADD_NOTIFICATION,
          length: response.data.length,
          data: response.data.notifications,
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

  handleOpen = (event) => {
    store.dispatch({ type: CLEAR_NOTIFICATION });
    this.setState({ anchorEl: event.target });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleMenuOpened = () => {
    axios
      .get("/mark", {
        params: { handle: localStorage.getItem("user") },
      })
      .catch((err) => console.error(err));
  };

  render() {
    const { backButton, history, classes, data } = this.props;
    const anchorEl = this.state.anchorEl;

    dayjs.extend(relativeTime);

    let notifications = data.notifications;
    let notificationsIcon;

    notifications && notifications.length > 0
      ? (notificationsIcon = (
          <Badge badgeContent={notifications.length} color="secondary">
            <NotificationsNone
              className={classes.headerIcon}
              fontSize="large"
            />
          </Badge>
        ))
      : (notificationsIcon = <NotificationsNone className={classes.icons} />);

    let notificationsMarkup =
      notifications && notifications.length > 0 ? (
        notifications.data.map((notification) => {
          const verb = "like";
          const time = dayjs(notification.date).fromNow();
          const iconColor = notification.received ? "primary" : "secondary";
          const icon = (
            <FavoriteIcon
              color={iconColor}
              className={classes.notificationIcon}
            />
          );

          return (
            <MenuItem key={notification.date} onClick={this.handleClose}>
              {icon}
              <Typography
                variant="body1"
                className={classes.notificationTypography}
              >
                {notification.user} {verb} your taste {time}
              </Typography>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem onClick={this.handleClose}>
          You have no notifications
        </MenuItem>
      );

    return (
      <>
        <Container className={classes.header}>
          {this.props.profile ? null : backButton ? (
            <IconButton onClick={() => history.replace(backButton)}>
              <ArrowBackIos className={classes.icons} />
            </IconButton>
          ) : (
            <Link to="/profile">
              <IconButton>
                <PermIdentity className={classes.icons} />
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
          <Tooltip placement="top" title="Notifications">
            <IconButton
              aria-owns={anchorEl ? "simple-menu" : undefined}
              aria-haspopup="true"
              onClick={this.handleOpen}
            >
              {notificationsIcon}
            </IconButton>
          </Tooltip>
        </Container>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onEntered={this.handleMenuOpened}
        >
          {notificationsMarkup}
        </Menu>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps)(
  withRouter(withStyles(headerStyles)(Header))
);
