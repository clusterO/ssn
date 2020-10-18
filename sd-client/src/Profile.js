import React, { Component } from "react";

export class Profile extends Component {
  render() {
    const { display_name, id, email, href, country, url, spotify } = this.props;
    return (
      <>
        <h1>Logged in as {{ display_name }}</h1>
        <div class="media">
          <div class="pull-left">
            <img
              class="media-object"
              width="150"
              alt="profile"
              src="{{images.0.url}}"
            />
          </div>
          <div class="media-body">
            <dl class="dl-horizontal">
              <dt>Display name</dt>
              <dd class="clearfix">{{ display_name }}</dd>
              <dt>Id</dt>
              <dd>{{ id }}</dd>
              <dt>Email</dt>
              <dd>{{ email }}</dd>
              <dt>Spotify URI</dt>
              <dd>
                <a href="{{external_urls.spotify}}">{{ spotify }}</a>
              </dd>
              <dt>Link</dt>
              <dd>
                <a href="{{href}}">{{ href }}</a>
              </dd>
              <dt>Profile Image</dt>
              <dd class="clearfix">
                <a href="{{images.0.url}}">{{ url }}</a>
              </dd>
              <dt>Country</dt>
              <dd>{{ country }}</dd>
            </dl>
          </div>
        </div>
      </>
    );
  }
}

export default Profile;
