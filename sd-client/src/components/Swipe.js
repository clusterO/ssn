import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles, IconButton, Container, Tooltip } from "@material-ui/core";
import { Store, Waves, Mic, Explore, Forum } from "@material-ui/icons";
import { connect } from "react-redux";
import styles from "../styles";
import { ReactMic } from "react-mic";
import axios from "axios";

const swipeStyles = theme => ({
  ...styles.swipeStyles,
});

export class Swipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
    };
  }

  componentDidMount() {}

  xazam = url => {
    axios.post("/xazam", { sample: url }).then(data => {
      console.log(data);
    });
  };

  handleRecording = () => {
    this.setState({ record: !this.state.record });
  };

  onStop = recordedBlob => {
    // let xhr = new XMLHttpRequest();
    // xhr.responseType = "blob";
    // xhr.onload = function () {
    //   let recoveredBlob = xhr.response;
    //   let reader = new FileReader();

    //   reader.onload = function () {
    //     let blobAsDataUrl = reader.result;
    //     window.location = blobAsDataUrl;
    //   };

    //   reader.readAsDataURL(recoveredBlob);
    // };

    // xhr.open("GET", recordedBlob.blobURL);
    // xhr.send();

    var request = new XMLHttpRequest();
    request.open("GET", recordedBlob.blobURL, true);
    request.responseType = "blob";
    request.onload = function () {
      console.log(request.response);
      axios.post("/xazam", request.response).then(data => {
        console.log(data);
      });
    };
    request.send();
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <Container className={classes.swipeRoot}>
          <Tooltip title="Beats market" placement="top">
            <Link to="/store">
              <IconButton className={classes.swipeButtonsRepeat}>
                <Store fontSize="large" />
              </IconButton>
            </Link>
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
        <ReactMic
          className={classes.mic}
          record={this.state.record}
          onStop={this.onStop}
          mimeType="audio/mp3"
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
