import React, { Component } from "react";
import TinderCard from "react-tinder-card";
import uuid from "react-uuid";
import { Container, Typography, withStyles } from "@material-ui/core";
import {
  setHandle,
  getUserDetails,
  swipeProfile,
} from "../redux/actions/dataActions";
import { connect } from "react-redux";
import axios from "axios";
import styles from "../styles";
import Tracks from "./Tracks";

const cardStyles = (theme) => ({
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10vh",
    [theme.breakpoints.down("sm")]: {
      height: "55vh !important",
    },
  },
  score: {
    color: "#ff073a",
  },
  ...styles.cardStyles,
});

export class Cards extends Component {
  componentDidMount() {
    this.props.getUserDetails();
  }

  onCardLeftScreen = (direction) => {
    if (direction === "right") this.match(this.props.data.handle);
    this.props.swipeProfile();
  };

  match = (handle) => {
    axios
      .get("/hit", { params: { handle, user: localStorage.getItem("user") } })
      .catch((err) => {});
  };

  onSwipe = (name) => {};

  render() {
    const { classes } = this.props;
    const { cards } = this.props.data;

    // Temporary code
    cards.profiles.push({
      name: "This feature starts soon...",
      url:
        "https://i.pinimg.com/originals/97/ed/6b/97ed6b370803649addbf66144c18c194.png",
    });

    cards.tracks = true;

    return (
      <>
        <div className={classes.cardContainer}>
          {cards.profiles.map((profile) => (
            <TinderCard
              onSwipe={() => this.onSwipe(profile.name)}
              onCardLeftScreen={this.onCardLeftScreen}
              className={classes.swipe}
              key={uuid()}
              preventSwipe={["up", "down"]}
            >
              <Container
                style={{ backgroundImage: `url(${profile.url})` }}
                className={classes.card}
              >
                <Typography variant="h4">{profile.name}</Typography>
                <Typography variant="h4">2938/10000 users</Typography>
                <Typography className={classes.score} variant="h6">
                  matching score of 88%
                </Typography>
              </Container>
            </TinderCard>
          ))}
        </div>
        <div className={classes.tracks}>
          {cards.tracks ? <Tracks render={true} /> : null}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
});

const mapDispatchToProps = {
  setHandle,
  getUserDetails,
  swipeProfile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(cardStyles)(Cards));
