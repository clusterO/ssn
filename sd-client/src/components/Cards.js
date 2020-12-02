import React, { Component } from "react";
import TinderCard from "react-tinder-card";
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
      marginTop: "5vh",
      height: "55vh !important",
    },
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

  onSwipe = (identifier) => {
    //this.props.setHandle(identifier);
  };

  match = (handle) => {
    axios
      .get("/match", { params: { handle } })
      .then((data) => {
        // console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    const { classes } = this.props;
    const { cards } = this.props.data;

    return (
      <>
        <div className={classes.cardContainer}>
          {cards.profiles.map((profile) => (
            <TinderCard
              onSwipe={() => this.onSwipe(profile.name)}
              onCardLeftScreen={this.onCardLeftScreen}
              className={classes.swipe}
              key={profile.name}
              preventSwipe={["up", "down"]}
            >
              <Container
                style={{ backgroundImage: `url(${profile.url})` }}
                className={classes.card}
              >
                <Typography variant="h4">{profile.name}</Typography>
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
