const request = require("request");
const querystring = require("querystring");
const config = require("../utils/config");

const client_id = config.clientId;
const client_secret = config.clientSecret;
const redirect_uri = "http://localhost:8888/callback";

const stateKey = "spotify_auth_state";

exports.login = (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = "user-read-private user-read-email";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        client_id: client_id,
        response_type: "code",
        redirect_uri: redirect_uri,
        scope: scope,
        state: state,
      })
  );
};

exports.callback = (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    console.log(code);
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token,
          refresh_token = body.refresh_token;

        const options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };

        request.get(options, (error, response, body) => {
          console.log(body);
        });

        res.redirect(
          "/#" +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
            })
        );
      } else {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
};

exports.refresh_token = (req, res) => {
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
};

exports.getUser = (token, user) => {
  const url = `https://api.spotify.com/v1/users/${user}`;
  callSpotify(token, url);
};

exports.getSavedTracks = token => {
  const url = "https://api.spotify.com/v1/me/tracks";
  callSpotify(token, url);
};

exports.getAlbums = token => {
  const url = "https://api.spotify.com/v1/me/albums";
  callSpotify(token, url);
};

exports.getUserTops = (token, type) => {
  const url = `https://api.spotify.com/v1/me/top/${type}`;
  callSpotify(token, url);
};

const callSpotify = (token, url) => {
  const options = {
    url: url,
    headers: {
      Authorization: "Bearer " + token,
    },
    json: true,
  };
  request.get(options, (error, response, body) => {
    console.log(body);
  });
};

const generateRandomString = length => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};
