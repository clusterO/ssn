import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import dayjs from "dayjs";
import * as io from "socket.io-client";

import {
  withStyles,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Box,
  CircularProgress,
  Grid,
  Button,
  IconButton,
} from "@material-ui/core";
import {
  PersonPinCircle,
  FilterList,
  DirectionsRun,
  ExitToApp,
} from "@material-ui/icons";

import store from "../redux/store";
import { userLogout, setProfile } from "../redux/actions/dataActions";
import { SET_AUTHENTICATED, ADD_NOTIFICATION } from "../redux/types";
import styles from "../styles";
import { getHashParams } from "../utils/hash";
import Swipe from "./Swipe";
import Header from "./Header";

const profileStyles = (theme) => ({
  media: {
    borderRadius: "50%",
    [theme.breakpoints.down("sm")]: {
      width: "100px",
      height: "100px",
    },
    [theme.breakpoints.up("md")]: {
      width: "150px",
      height: "150px",
    },
    [theme.breakpoints.up("lg")]: {
      width: "150px",
      height: "150px",
    },
  },
  ...styles.loginStyles,
  ...styles.profileStyles,
});

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.params = getHashParams();
    this.socket = null;
    this.state = {
      hide: true,
      progress: false,
    };
  }

  componentDidMount() {
    if (this.props.redirect) this.props.history.push("/profile");

    if (!localStorage.getItem("accessToken")) {
      localStorage.setItem("accessToken", this.params.access_token);
      localStorage.setItem("refreshToken", this.params.refresh_token);
      localStorage.setItem("expireTime", dayjs(Date.now()).add(1, "hour"));
      axios.defaults.headers.common["authorization"] = this.params.access_token;
      store.dispatch({ type: SET_AUTHENTICATED });
    }

    if (!localStorage.getItem("id")) this.getProfile();

    this.realTimeNotifications(this.params.user);
  }
  // wss://spotidate.herokuapp.com
  realTimeNotifications = (user) => {
    if (!user) user = localStorage.getItem("user");

    this.socket = io("ws://localhost:8888", {
      query: { handle: user, event: "notification" },
    });

    this.socket.on("notification", (data) => {
      store.dispatch({
        type: ADD_NOTIFICATION,
        length: 1,
        data: [{ id: data.id, handle: data.handle, date: data.date }],
      });
    });
  };

  getProfile = () => {
    this.props.setProfile();
  };

  authorizeSpotify = () => {
    window.location.href = "http://localhost:8888/login";
  };
  // https://spotidate.herokuapp.com
  logout = () => {
    this.socket.emit("notification", localStorage.getItem("user"));
    this.props.userLogout();
    this.props.history.replace("/");
  };

  handleHide = () => {
    this.setState({ hide: !this.state.hide });
  };

  render() {
    const { classes } = this.props;
    const {
      display_name,
      id,
      email,
      country,
      images,
      spotify,
      followers,
    } = this.props.data.profile;

    return (
      <>
        <Header profile={true} socket={this.socket} />
        {localStorage.getItem("accessToken") ? (
          <Grid className={classes.rootProfile}>
            <Card variant="outlined">
              <CardContent>
                <Container className={classes.details}>
                  {images && images[0].url ? (
                    <div>
                      <CardMedia
                        className={classes.media}
                        image={images ? images[0].url : "/profile.png"}
                        title="Profile picture"
                      />
                      <Container className={classes.profileInfos}>
                        <Box>
                          <PersonPinCircle />
                          <Typography variant="body2" component="p">
                            {country}
                          </Typography>
                        </Box>
                        <Box>
                          <FilterList />
                          <Typography variant="body2" component="p">
                            {spotify}
                          </Typography>
                        </Box>
                        <Box>
                          <DirectionsRun />
                          <Typography variant="body2" component="p">
                            {followers ? followers.total : ""}
                          </Typography>
                        </Box>
                      </Container>
                    </div>
                  ) : (
                    <CircularProgress />
                  )}

                  <Container>
                    <Typography variant="h5" component="h2">
                      {display_name}
                      <IconButton onClick={this.logout}>
                        <ExitToApp />
                      </IconButton>
                    </Typography>
                    <Typography
                      onClick={this.handleHide}
                      className={classes.pos}
                      color="textSecondary"
                    >
                      {this.state.hide ? "show password" : id}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {email}
                    </Typography>
                  </Container>
                </Container>
              </CardContent>
            </Card>
            <Swipe token={true} />
          </Grid>
        ) : (
          <>
            <Swipe />
            <Grid container justify="center">
              <Button
                className={classes.spotifyButton}
                variant="outlined"
                color="primary"
                style={{ textTransform: "none" }}
                onClick={this.authorizeSpotify}
              >
                <FilterList />
                Authorize Login
              </Button>
            </Grid>
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
});

const mapDispatchToProps = {
  userLogout,
  setProfile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(profileStyles)(Profile)));
