import React, { Component } from "react";

export class Login extends Component {
  login = () => {
    window.location.href = "http://localhost:8888/login";
  };

  render() {
    return (
      <>
        <div className="container">
          <div id="login">
            <h1>Authorization Code flow</h1>
            <button className="btn btn-primary" onClick={this.login}>
              Log in with Spotify
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default Login;
