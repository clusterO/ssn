import React, { Component } from "react";
import {
  withStyles,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@material-ui/core";
import PersonPinCircleIcon from "@material-ui/icons/PersonPinCircle";
import FilterListIcon from "@material-ui/icons/FilterList";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import axios from "axios";

const styles = theme => ({
  root: {
    width: "40%",
    margin: "auto auto",
    marginTop: "20%",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
});

export class Profile extends Component {
  constructor() {
    super();
    this.params = this.getHashParams();
    this.token = this.params.access_token;
    this.refresh_token = this.params.refresh_token;
    this.state = {
      loggedIn: this.token ? true : false,
      data: {
        display_name: "",
        id: "",
        email: "",
        href: "",
        country: "",
        images: [],
        external_urls: { spotify: "" },
        followers: { total: null },
      },
    };
  }

  getHashParams = () => {
    let hashParams = {};
    let e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }

    return hashParams;
  };

  getProfile = () => {
    axios.post("http://localhost:8888/me", { token: this.token }).then(body => {
      this.setState({ data: { ...body.data } });
      console.log(this.state.data);
    });
  };

  componentDidMount() {
    this.getProfile();
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
    } = this.state.data;

    return (
      <>
        <Card className={classes.root} variant="outlined">
          <CardContent>
            <div>
              <CardMedia
                className={classes.media}
                image={images[0]}
                title="Profile picture"
              />
              <Typography variant="h5" component="h2">
                {display_name}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                {id}
              </Typography>
              <Typography variant="body2" component="p">
                {email}
              </Typography>
              <Typography variant="body2" component="p">
                {href}
              </Typography>
            </div>
            <div>
              <PersonPinCircleIcon />
              <Typography variant="body2" component="p">
                {country}
              </Typography>
              <FilterListIcon />
              <Typography variant="body2" component="p">
                {spotify}
              </Typography>
              <DirectionsRunIcon />
              <Typography variant="body2" component="p">
                {followers.total}
              </Typography>
            </div>
          </CardContent>
        </Card>

        <h4>{display_name}</h4>
        <h4>{id}</h4>
        <h4>{email}</h4>
        <h4>{href}</h4>
        <h4>{country}</h4>
        <h4>{spotify}</h4>
        <h4>{images}</h4>
        <h4>{followers.total}</h4>
      </>
    );
  }
}

export default withStyles(styles)(Profile);
