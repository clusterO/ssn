import React, { Component } from "react";
import {
  withStyles,
  Card,
  CardMedia,
  CardContent,
  Typography,
  FormHelperText,
  Paper,
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
  details: {
    display: "flex",
  },
  infos: {
    display: "flex",
    width: "40%",
    justifyContent: "space-between",
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
    width: "50%",
    height: "200px",
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
        images: [{ url: "" }],
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
                <Typography variant="body2" component="p">
                  {href}
                </Typography>
              </div>
            </div>
            <div className={classes.infos}>
              <span>
                <PersonPinCircleIcon />
                <Typography variant="body2" component="p">
                  {country}
                </Typography>
              </span>
              <span>
                <FilterListIcon />
                <Typography variant="body2" component="p">
                  {spotify}
                </Typography>
              </span>
              <span>
                <DirectionsRunIcon />
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
