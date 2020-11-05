import React, { Component } from "react";
import { withStyles } from "@material-ui/core";
import Message from "./Message";
import { connect } from "react-redux";
import axios from "axios";

const styles = theme => ({});

export class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
    };
  }

  componentDidMount() {
    this.getFriendsList();
  }

  getFriendsList = () => {
    axios
      .get("/friends", { params: { handle: this.props.data.user } })
      .then(body => {
        this.setState({ friends: body });
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.chats}>
        {this.state.friends.forEach(friend => {
          return (
            <Message
              handle={friend.handle}
              message={friend.message}
              timestamp={friend.timestamp}
              image={friend.image}
            />
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
});

export default connect(mapStateToProps)(withStyles(styles)(Contacts));
