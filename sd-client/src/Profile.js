import React, { Component } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import axios from "axios";

const spotifyApi = new SpotifyWebApi();

export class Profile extends Component {
  constructor() {
    super();
    this.params = this.getHashParams();
    this.token = this.params.access_token;
    this.refresh_token = this.params.refresh_token;
    this.state = {
      loggedIn: this.token ? true : false,
      nowPlaying: { name: "Not Checked", albumArt: "" },
    };
  }

  getHashParams = () => {
    let hashParams = {};
    let e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }

    return hashParams;
  };

  getProfile = () => {
    if (this.token) {
      spotifyApi.setAccessToken(this.token);

      spotifyApi.getMe().then(me => {
        console.log(me);
      });
    }
  };

  refreshToken = () => {
    axios
      .get(`/refresh`, { data: { refresh_token: this.refresh_token } })
      .then(data => {
        this.access_token = data.access_token;
      });
  };

  render() {
    // const { display_name, id, email, href, country, url, spotify } = this.data;
    return (
      <>
        <button onClick={this.getProfile}>Hello</button>
      </>
    );
  }
}

export default Profile;
