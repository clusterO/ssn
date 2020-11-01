import React, { Component } from "react";
import TinderCard from "react-tinder-card";
import { withStyles } from "@material-ui/core";
import axios from "axios";

const styles = theme => ({
  card: {
    position: "relative",
    width: "600px",
    height: "50vh",
    padding: "20px",
    maxWidth: "85vw",
    borderRadius: "20px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0px 18px 53px 0px rgba(0, 0, 0, 0.3)",
  },
  h3: {
    position: "absolute",
    bottom: "10px",
    color: "white",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10vh",
  },
  swipe: {
    position: "absolute",
  },
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

    axios.post("http://localhost:8888/profile", body).then(body => {
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

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.cardContainer}>
          {this.state.profiles.map(profile => (
            <TinderCard
              className={classes.swipe}
              key={profile.name}
              preventSwipe={["up", "down"]}
            >
              <div
                style={{ backgroundImage: `url(${profile.url})` }}
                className={classes.card}
              >
                <h3>{profile.name}</h3>
              </div>
            </TinderCard>
          ))}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Cards);
