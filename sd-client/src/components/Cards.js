import React, { Component } from "react";
import TinderCard from "react-tinder-card";
import { Container, Typography, withStyles } from "@material-ui/core";
import { setHandle } from "../redux/actions/dataActions";
import { connect } from "react-redux";
import axios from "axios";
import styles from "../styles";

const cardStyles = () => ({
  ...styles.cardStyles,
});

export class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: [
        {
          name: "John Doe",
          url:
            "https://www.yourtango.com/sites/default/files/image_blog/types-guys-who-stay-single-men.jpg",
        },
        {
          name: "Jane Doe",
          url:
            "https://i.pinimg.com/originals/97/ed/6b/97ed6b370803649addbf66144c18c194.png",
        },
      ],
    };
  }

  getUserDetails = () => {
    let body = { handle: "fourmou.m" };

    axios.post("/profile", body).then(body => {
      const profiles = [];
      if (body.data.match?.matchs)
        body.data.match.matchs.forEach(match => {
          profiles.push({
            name: match.display_name,
            url: match.images[0].url,
          });
        });
      this.setState({ profiles: [...this.state.profiles, ...profiles] });
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
