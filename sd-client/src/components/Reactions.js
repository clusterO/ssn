import React, { Component } from "react";
import { withStyles, IconButton } from "@material-ui/core";
import styles from "../styles";
import axios from "axios";

const reactionStyles = theme => ({
  ...styles.reactionStyles,
});

export class Reactions extends Component {
  react = reaction => {
    axios
      .post("/react", {
        reaction,
        messageId: this.props.messageId,
        from: this.props.from,
        to: this.props.to,
      })
      .then()
      .catch(err => console.error(err));
  };

  render() {
    const { classes } = this.props;
    const reactions = ["💗", "👏", "🌷", "🥰"];

    return (
      <>
        {reactions.map((reaction, index) => (
          // Doesn't work properly inside popover
          <IconButton
            variant="link"
            className={classes.reaction}
            key={index}
            onClick={() => this.react(reaction)}
          >
            <span role="img" aria-label="emoji">
              {reaction}
            </span>
          </IconButton>
        ))}
      </>
    );
  }
}

export default withStyles(reactionStyles)(Reactions);
