import React, { Component } from "react";
import TinderCard from "react-tinder-card";
import { Container, Typography, withStyles } from "@material-ui/core";
import { setHandle, getUserDetails } from "../redux/actions/dataActions";
import { connect } from "react-redux";
import axios from "axios";
import styles from "../styles";
import Tracks from "./Tracks";

const cardStyles = () => ({
  ...styles.cardStyles,
});

export class Cards extends Component {
  componentDidMount() {
    this.props.getUserDetails();
  }

  onCardLeftScreen = direction => {
    if (direction === "right") this.match(this.props.data.handle);
  };

  onSwipe = identifier => {
    this.props.setHandle(identifier);
  };

  match = handle => {
    axios
      .get("/match", { params: { handle } })
      .then(data => {
        // console.log(data);
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    const { classes } = this.props;
    const { cards } = this.props.data;

    return (
      <>
        <Container className={classes.cardContainer}>
          {cards.profiles.map(profile => (
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
        </Container>
        {cards.tracks ? <Tracks /> : null}
      </>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
});

const mapDispatchToProps = {
  setHandle,
  getUserDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(cardStyles)(Cards));
