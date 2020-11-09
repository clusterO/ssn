import React, { Component } from "react";
import { Container, withStyles } from "@material-ui/core";
import Message from "./Message";
import { connect } from "react-redux";
import axios from "axios";

const contactStyles = theme => ({});

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
    //replace handle this.props.data.user
    axios.get("/friends", { params: { handle: "jane.m" } }).then(body => {
      this.setState({ friends: body.data });
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.chats}>
        {this.state.friends.map((friend, index) => (
          <Message
            key={index}
            handle={friend.handle}
            message={friend.message}
            timestamp={friend.timestamp}
            image={friend.image}
          />
        ))}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
});

export default connect(mapStateToProps)(withStyles(contactStyles)(Contacts));
