import React, { Component } from "react";
import {
  withStyles,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { PersonPinCircle, FilterList, DirectionsRun } from "@material-ui/icons";
import axios from "axios";
import { CURRENT_USER } from "../redux/types";
import store from "../redux/store";

const styles = theme => ({
  root: {
    margin: "auto auto",
    marginTop: "20%",
  },
  details: {
    display: "flex",
  },
  infos: {
    display: "flex",
    width: "30%",
    justifyContent: "space-evenly",
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
    width: "100px",
    paddingTop: "56.25%",
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
        images: [{ url: "" }],
        external_urls: { spotify: "" },
        followers: { total: null },
      },
    };
    store.dispatch({ type: CURRENT_USER, user: this.params.user });
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
            <div className={classes.details}>
              <CardMedia
                className={classes.media}
                image={images[0].url}
                title="Profile picture"
              />
              <div>
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
              </div>
            </div>
            <div className={classes.infos}>
              <span>
                <PersonPinCircle />
                <Typography variant="body2" component="p">
                  {country}
                </Typography>
              </span>
              <span>
                <FilterList />
                <Typography variant="body2" component="p">
                  {spotify}
                </Typography>
              </span>
              <span>
                <DirectionsRun />
                <Typography variant="body2" component="p">
                  {followers.total}
                </Typography>
              </span>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }
}

export default withStyles(styles)(Profile);
