import React, { Component } from "react";
import TinderCard from "react-tinder-card";
import { withStyles } from "@material-ui/core";

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
    state: {
      people: [];
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.cardContainer}>
          {people.map(person => (
            <TinderCard
              className={classes.swipe}
              key={person.name}
              preventSwipe={["up", "down"]}
            >
              <div
                style={{ backgroundImage: `url(${person.url})` }}
                className={classes.card}
              >
                <h3>{person.name}</h3>
              </div>
            </TinderCard>
          ))}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Cards);
