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
  Container,
} from "@material-ui/core";
import { Face, Fingerprint } from "@material-ui/icons";
import FilterListIcon from "@material-ui/icons/FilterList";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import store from "../redux/store";
import { CURRENT_USER } from "../redux/types";

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
    width: "70%",
  },
  spotifyButton: {
    margin: "auto auto",
    backgroundColor: "#1EDE62",
    color: "#000000",
  },
});

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      handle: "",
      confirmPassword: "",
      value: 0,
      signup: 0,
      action: "SignUp",
      submit: "Login",
    };
  }

  login = () => {
    window.location.href = "http://localhost:8888/login";
  };

  signup = () => {
    this.setState({ signup: !this.state.signup });
    if (this.state.action === "Login")
      this.setState({ action: "SignUp", submit: "Login" });
    else this.setState({ action: "Login", submit: "SignUp" });
  };

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };

  handleInput = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  mailSign = () => {
    if (this.state.submit === "Login")
      axios
        .post("/signin", {
          email: this.state.email,
          password: this.state.password,
        })
        .then(body => {
          store.dispatch({ type: CURRENT_USER, user: body.data.handle });
        })
        .catch(err => console.error(err));
    else
      axios
        .post("/signup", {
          email: this.state.email,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword,
          handle: this.state.handle,
        })
        .then(body => {
          store.dispatch({ type: CURRENT_USER, user: body.data.handle });
        })
        .catch(err => console.error(err));
  };

  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.container}>
        <Paper square>
          <Tabs
            value={this.state.value}
            indicatorColor="primary"
            textColor="primary"
            onChange={this.handleChange}
            aria-label="disabled tabs example"
            variant="fullWidth"
          >
            <Tab label="Spotify" />
            <Tab label="Email" />
          </Tabs>
        </Paper>
        <Paper className={classes.paper}>
          {this.state.value === 1 ? (
            <Container className={classes.form}>
              {this.state.signup ? (
                <Grid container spacing={5} alignItems="flex-end">
                  <Grid item>
                    <Face />
                  </Grid>
                  <Grid item md={true} sm={true} xs={true}>
                    <TextField
                      id="handle"
                      name="handle"
                      label="Handle"
                      type="handle"
                      fullWidth
                      required
                      onChange={this.handleInput}
                    />
                  </Grid>
                </Grid>
              ) : null}
              <Grid container spacing={5} alignItems="flex-end">
                <Grid item>
                  <AlternateEmailIcon />
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                  <TextField
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    autoFocus
                    required
                    onChange={this.handleInput}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={5} alignItems="flex-end">
                <Grid item>
                  <Fingerprint />
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                  <TextField
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    onChange={this.handleInput}
                  />
                </Grid>
              </Grid>
              {this.state.signup ? (
                <Grid container spacing={5} alignItems="flex-end">
                  <Grid item>
                    <Fingerprint />
                  </Grid>
                  <Grid item md={true} sm={true} xs={true}>
                    <TextField
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Confirm Password"
                      type="confirmPassword"
                      fullWidth
                      required
                      onChange={this.handleInput}
                    />
                  </Grid>
                </Grid>
              ) : null}
              <Grid container alignItems="center" justify="space-between">
                <Grid item>
                  <FormControlLabel
                    control={<Checkbox color="primary" />}
                    label="Remember me"
                  />
                </Grid>
                <Grid item>
                  <Button
                    disableFocusRipple
                    disableRipple
                    style={{ textTransform: "none" }}
                    variant="text"
                    color="primary"
                    onClick={this.signup}
                  >
                    {this.state.action}
                  </Button>
                </Grid>
              </Grid>
              <Grid container justify="center" style={{ marginTop: "10px" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ textTransform: "none" }}
                  onClick={this.mailSign}
                >
                  {this.state.submit}
                </Button>
              </Grid>
            </Container>
          ) : (
            <Grid container justify="center">
              <Button
                className={classes.spotifyButton}
                variant="outlined"
                color="primary"
                style={{ textTransform: "none" }}
                onClick={this.login}
              >
                <FilterListIcon />
                Authorize Login
              </Button>
            </Grid>
          )}
        </Paper>
      </Container>
    );
  }
}

export default withStyles(styles)(Login);
