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
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { PersonPinCircle, FilterList, DirectionsRun } from "@material-ui/icons";
import axios from "axios";
import { CURRENT_USER, SET_PROFILE } from "../redux/types";
import store from "../redux/store";
import styles from "../styles";
import { getHashParams } from "../utils/hash";
import { connect } from "react-redux";
import Swipe from "./Swipe";

const profileStyles = theme => ({
  ...styles.profileStyles,
});

export class Profile extends Component {
  constructor() {
    super();
    this.params = getHashParams();
    this.token = this.params.access_token;
    this.refresh_token = this.params.refresh_token;
  }

  getProfile = () => {
    axios.get("/me", { params: { token: this.token } }).then(body => {
      store.dispatch({
        type: SET_PROFILE,
        token: this.token,
        data: { ...body.data },
      });
    });
  };

  componentDidMount() {
    if (!this.props.data.loggedIn) {
      store.dispatch({ type: CURRENT_USER, user: this.params.user });
      this.getProfile();
    }
  }

  refreshToken = () => {
    axios
      .get(`/refresh`, { data: { refresh_token: this.refresh_token } })
      .then(data => {
        this.access_token = data.access_token;
      });
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
            </Container>
          </CardContent>
        </Card>
        <Swipe />
      </>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
});

export default connect(mapStateToProps)(withStyles(profileStyles)(Profile));
