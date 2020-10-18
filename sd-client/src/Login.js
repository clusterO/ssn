import React, { Component } from "react";
import Auth from "./oAuth";
import Profile from "./Profile";
import axios from "axios";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.access_token = null;
    this.refresh_token = null;
    this.data = {};
    this.state = {
      authenticated: false,
    };
  }

  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  getHashParams = () => {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  };

  refreshToken = () => {
    axios
      .get(`/refresh`, { data: { refresh_token: this.refresh_token } })
      .then(data => {
        this.access_token = data.access_token;
      });
  };

  getToken = () => {
    axios.get(`/login`).then(() => {
      let params = this.getHashParams();
      let error = params.error;

      this.access_token = params.access_token;
      this.refresh_token = params.refresh_token;

      if (error) alert("There was an error during the authentication");

      if (this.access_token) {
        axios.defaults.headers.common["Authorization"] = this.access_token;
        axios.get(`/profile`, {}).then(response => {
          this.data = response;
          this.setState({ authenticated: true });
        });
      } else this.setState({ authenticated: false });
    });
  };

  render() {
    return (
      <>
        <div className="container">
          {this.state.authenticated ? (
            <div id="loggedin">
              <Profile data />
              <Auth access_token refresh_token />
              <button className="btn btn-default" onClick={this.refreshToken}>
                Obtain new token using the refresh token
              </button>
            </div>
          ) : (
            <div id="login">
              <h1>Authorization Code flow</h1>
              <button className="btn btn-primary" onClick={this.getToken}>
                Log in with Spotify
              </button>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default Login;
