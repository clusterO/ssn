import React, { Component } from "react";
import TinderCard from "react-tinder-card";
import { Container, Typography, withStyles } from "@material-ui/core";
import { setHandle } from "../redux/actions/dataActions";
import { connect } from "react-redux";
import axios from "axios";
import styles from "../styles";
import Tracks from "./Tracks";

const cardStyles = () => ({
  ...styles.cardStyles,
});

export class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: false,
      profiles: [],
    };
  }

  getUserDetails = () => {
    let body = { handle: this.props.data.user };

    axios.post("/profile", body).then(body => {
      const profiles = [];
      if (body.data.match?.matchs)
        body.data.match.matchs.forEach(match => {
          profiles.push({
            name: match.display_name,
            url: match.images[0].url,
          });
        });

      this.props.setHandle(profiles[profiles.length - 1].name);
      this.setState({ profiles: [...profiles], tracks: true });
    });
  };

  componentDidMount() {
    this.getUserDetails();
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
    return (
      <>
        <Container className={classes.cardContainer}>
          {this.state.profiles.map(profile => (
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
                <Typography>{profile.name}</Typography>
              </Container>
            </TinderCard>
          ))}
        </Container>
        {this.state.tracks ? <Tracks /> : null}
      </>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
});

const mapDispatchToProps = {
  setHandle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(cardStyles)(Cards));
