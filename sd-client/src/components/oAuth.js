import React, { Component } from "react";

export class oAuth extends Component {
  render() {
    const { access_token, refresh_token } = this.props;
    return (
      <>
        <h2>oAuth info</h2>
        <dl class="dl-horizontal">
          <dt>Access token</dt>
          <dd class="text-overflow">{{ access_token }}</dd>
          <dt>Refresh token</dt>
          <dd class="text-overflow">{{ refresh_token }}</dd>
        </dl>
      </>
    );
  }
}

export default oAuth;
