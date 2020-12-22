import React, { Component } from "react";
import uuid from "react-uuid";
import { Container, withStyles } from "@material-ui/core";
import Message from "./Message";
import { connect } from "react-redux";
import axios from "axios";
import Header from "./Header";

const contactStyles = (theme) => ({
  contacts: {
    paddingTop: "8vh",
  },
});

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
      .get("/friends", { params: { handle: localStorage.getItem("user") } })
      .then((body) => {
        this.setState({ friends: body.data });
      })
      .catch((err) => console.error(err));
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <Header backButton="/profile" />
        <Container className={classes.contacts}>
          {this.state.friends.map((friend, index) => (
            <Message
              key={uuid()}
              handle={friend.handle}
              message={friend.message}
              timestamp={friend.timestamp}
              image={friend.image}
            />
          ))}
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps)(withStyles(contactStyles)(Contacts));
