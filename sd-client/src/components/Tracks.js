import React, { Component } from "react";
import {
  withStyles,
  Typography,
  CardMedia,
  CircularProgress,
} from "@material-ui/core";
import axios from "axios";
import { connect } from "react-redux";
import styles from "../styles";

const tracksStyles = (theme) => ({
  ...styles.tracksStyles,
});

export class Tracks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recentlyPlayed: [],
    };
  }

  componentWillReceiveProps() {
    this.getRecentlyPlayed();
  }

  getRecentlyPlayed = () => {
    let profiles = this.props.data.cards.profiles;

    if (profiles.length > 0)
      axios
        .get("/recent", {
          headers: {
            handle: profiles[profiles.length - 1].name,
            token: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          let tracks = [];
          res.data.map((track, index) => {
            if (index < 5)
              tracks.push({
                song: track.name,
                artist: track.artists[0].name,
                images: track.album.images,
              });

            return null;
          });

          this.setState({ recentlyPlayed: tracks });
        })
        .catch((err) => {
          console.error(err);
        });
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <Typography variant="h5">Recently played</Typography>
        {this.state.recentlyPlayed.map((track, index) => (
          <div className={classes.trackContainer} key={index}>
            {track.images && track.images[0].url ? (
              <CardMedia
                className={classes.media}
                image={
                  track.images
                    ? track.images[0].url
                    : "https://www.sleekcover.com/covers/girls-simple-pink-facebook-cover.jpg"
                }
                title="track picture"
              />
            ) : (
              <CircularProgress />
            )}
            <div className={classes.infos}>
              <Typography> {track.song}</Typography>
              <Typography> {track.artist}</Typography>
            </div>
          </div>
        ))}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps)(withStyles(tracksStyles)(Tracks));
