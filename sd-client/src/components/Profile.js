import React, { Component } from "react";
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
import { Link, withRouter } from "react-router-dom";
import {
  PersonPinCircle,
  FilterList,
  DirectionsRun,
  ExitToApp,
} from "@material-ui/icons";
import axios from "axios";
import { SET_PROFILE } from "../redux/types";
import { initializeAccess, userLogout } from "../redux/actions/dataActions";
import store from "../redux/store";
import styles from "../styles";
import { getHashParams } from "../utils/hash";
import { connect } from "react-redux";
import Swipe from "./Swipe";

const profileStyles = theme => ({
  ...styles.loginStyles,
  ...styles.profileStyles,
});

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.params = getHashParams();

    if (this.props.redirect) this.props.history.push("/profile");

    if (!localStorage.getItem("accessToken")) {
      localStorage.setItem("refreshToken", this.params.access_token);
      initializeAccess(this.params.access_token, this.params.user);
      this.refreshToken();
    }
  }

  componentDidMount() {
    this.getProfile();
  }

  refreshToken = () => {
    setInterval(() => {
      axios
        .get("/refresh", {
          params: { refresh_token: localStorage.getItem("refreshToken") },
        })
        .then(res => {
          initializeAccess(res.data.access_token, this.props.data.user);
        })
        .catch(err => console.error(err));
    }, (this.params.expires_in - 10) * 1000);
  };

  getProfile = () => {
    axios
      .get("/me", { params: { token: localStorage.getItem("accessToken") } })
      .then(body => {
        store.dispatch({
          type: SET_PROFILE,
          data: { ...body.data },
        });
      })
      .catch(err => console.error(err));
  };

  authorizeSpotify = () => {
    window.location.href = "http://localhost:8888/login";
  };

  logout = () => {
    this.props.userLogout();
    this.props.history.replace("/");
  };

  render() {
    const { classes } = this.props;
    const {
      display_name,
      id,
      email,
      href,
      country,
      images,
      spotify,
      followers,
    } = this.props.data.profile;

    return (
      <>
        {localStorage.getItem("accessToken") ? (
          <>
            <Card className={classes.root} variant="outlined">
              <CardContent>
                <Container className={classes.details}>
                  {images && images[0].url ? (
                    <CardMedia
                      className={classes.media}
                      image={
                        images
                          ? images[0].url
                          : "https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_1280.png"
                      }
                      title="Profile picture"
                    />
                  ) : (
                    <CircularProgress />
                  )}
                  <Container>
                    <Typography variant="h5" component="h2">
                      {display_name}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {id}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {email}
                    </Typography>
                    <Link to={href}>
                      <Typography variant="body2" component="p">
                        Spotify
                      </Typography>
                    </Link>
                  </Container>
                </Container>
                <Container className={classes.infos}>
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
                      {followers ? followers.total : null}
                    </Typography>
                  </Box>
                  <IconButton onClick={this.logout}>
                    <ExitToApp />
                  </IconButton>
                </Container>
              </CardContent>
            </Card>
            <Swipe token={true} />
          </>
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

const mapStateToProps = state => ({
  data: state.data,
});

const mapDispatchToProps = {
  userLogout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(profileStyles)(Profile)));
