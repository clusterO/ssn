import React, { Component } from "react";
import axios from "axios";
import {
  Paper,
  withStyles,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
} from "@material-ui/core";

const styles = theme => ({
  form: {
    margin: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing.unit,
    marginTop: "1px",
  },
  container: {
    margin: "10% auto 0 auto",
    width: "40%",
  },
  spotifyButton: {
    margin: "auto auto",
    backgroundColor: "#1EDE62",
    color: "#000000",
  },
});

class Explore extends Component {
  render() {
    return <div></div>;
  }
}

export default withStyle(styles)(Explore);
