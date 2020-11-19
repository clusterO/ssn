import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles, IconButton, Container, Tooltip } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Store, Waves, Mic, Explore, Forum } from "@material-ui/icons";
import { connect } from "react-redux";
import styles from "../styles";
import { ReactMic } from "react-mic";
import axios from "axios";

const swipeStyles = theme => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  ...styles.swipeStyles,
});

export class Swipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      alert: false,
      song: "",
      artist: "",
    };
  }

  handleRecording = () => {
    this.setState({ record: !this.state.record });
  };

  loadBlob(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "blob";
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    });
  }

  onStop = recordedBlob => {
    this.loadBlob(recordedBlob.blobURL)
      .then(async blob => {
        const data = new FormData();
        data.append("audio", blob);

        axios
          .post("/xazam", data)
          .then(response => {
            if (response.data.length > 0) {
              this.setState({
                alert: true,
                song: response.data[0].title,
                artist: response.data[0].artists[0].name,
              });

              setTimeout(() => {
                this.setState({
                  alert: false,
                  song: "",
                  artist: "",
                });
              }, 10000);
            }
          })
          .catch(err => console.error(err));
      })
      .catch(err => {
        console.error(`Could not load blob ${err}`);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <Container className={classes.swipeRoot}>
          <Tooltip title="Beats market" placement="top">
            <IconButton className={classes.swipeButtonsRepeat}>
              <Store fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Song recognition" placement="top">
            <IconButton
              className={classes.swipeButtonsLeft}
              onClick={this.handleRecording}
            >
              <Waves fontSize="large" />
            </IconButton>
          </Tooltip>
          {this.props.token ? (
            <Tooltip title="Explore" placement="top">
              <Link to="/explore">
                <IconButton
                  onClick={() => {}}
                  className={classes.swipeButtonsRight}
                >
                  <Explore fontSize="large" />
                </IconButton>
              </Link>
            </Tooltip>
          ) : null}
          <Tooltip title="Karaoke" placement="top">
            <Link to="/karaoke">
              <IconButton className={classes.swipeButtonsStar}>
                <Mic fontSize="large" />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Messages" placement="top">
            <Link to="/chat">
              <IconButton className={classes.messages}>
                <Forum fontSize="large" />
              </IconButton>
            </Link>
          </Tooltip>
        </Container>
        {this.state.alert ? (
          <div className={classes.root}>
            <Alert severity="success">
              {this.state.song} - {this.state.artist}
            </Alert>
          </div>
        ) : null}
        <ReactMic
          className={classes.mic}
          record={this.state.record}
          onStop={this.onStop}
          mimeType="audio/wav"
          noiseSuppression={true}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
});

export default connect(mapStateToProps)(withStyles(swipeStyles)(Swipe));
