import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles, IconButton, Container, Tooltip } from "@material-ui/core";
import { Store, Waves, Mic, Explore, Forum } from "@material-ui/icons";
import { connect } from "react-redux";
import styles from "../styles";

const swipeStyles = theme => ({
  ...styles.swipeStyles,
});

export class Swipe extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.swipeRoot}>
        <Tooltip title="Beats market" placement="top">
          <Link to="/store">
            <IconButton className={classes.swipeButtonsRepeat}>
              <Store fontSize="large" />
            </IconButton>
          </Link>
        </Tooltip>
        <Tooltip title="Song recognition" placement="top">
          <Link to="/song">
            <IconButton className={classes.swipeButtonsLeft}>
              <Waves fontSize="large" />
            </IconButton>
          </Link>
        </Tooltip>
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
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
});

export default connect(mapStateToProps)(withStyles(swipeStyles)(Swipe));
