import React, { Component } from "react";
import { withRouter } from "react-router-dom";
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
import styles from "../styles";
import { connect } from "react-redux";
import Profile from "./Profile";
import { setProfile } from "../redux/actions/dataActions";

const loginStyles = (theme) => ({
  container: {
    margin: "10% auto 0 auto",
    width: "70%",
    [theme.breakpoints.down("sm")]: {
      margin: "30% auto 0 auto",
      width: "100%",
    },
  },
  ...styles.loginStyles,
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

  handleChange = (_, newValue) => {
    this.setState({ value: newValue });
  };

  handleInput = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  mailSign = () => {
    if (this.state.submit === "Login")
      axios
        .post("/signin", {
          email: this.state.email,
          password: this.state.password,
        })
        .then((body) => {
          localStorage.setItem("id", body.data.id);
          localStorage.setItem("user", body.data.handle);
          localStorage.setItem("accessToken", body.data.accessToken);
          this.props.history.replace("/profile");
        })
        .catch((err) => console.error(err));
    else
      axios
        .post("/signup", {
          email: this.state.email,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword,
          handle: this.state.handle,
        })
        .then((body) => {
          this.props.setProfile();
          this.signup();
        })
        .catch((err) => console.error(err));
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        {localStorage.getItem("accessToken") &&
        Date.parse(localStorage.getItem("expireTime")) > Date.now() ? (
          <Profile redirect={true} />
        ) : (
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
                          type="password"
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
                  <Grid
                    container
                    justify="center"
                    style={{ marginTop: "10px" }}
                  >
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
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
});

const mapDispatchToProps = {
  setProfile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(loginStyles)(Login)));
