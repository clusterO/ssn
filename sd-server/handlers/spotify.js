const request = require("request");
const querystring = require("querystring");
const config = require("../utils/config");
const db = require("../models");
const { generateRandomString } = require("../utils/util");

const User = db.user;

const client_id = config.clientId;
const client_secret = config.clientSecret;
const redirect_uri = "http://localhost:8888/callback";

const stateKey = "spotify_auth_state";

exports.login = (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope =
    "user-read-private user-read-email user-library-read user-follow-read user-read-recently-played user-read-currently-playing user-read-playback-state user-top-read user-modify-playback-state";

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
        const access_token = body.access_token;
        const refresh_token = body.refresh_token;
        const expires_in = body.expires_in;

        const options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };

        request.get(options, (error, response, body) => {
          const email = body.email;
          const handle = email.split("@")[0];
          const data = {
            email,
            password: body.id,
            confirmPassword: body.id,
            handle,
          };

          const userOptions = {
            url: `http://${req.headers.host}/signup`,
            headers: { Authorization: "Bearer " + access_token },
            json: true,
            body: data,
          };

          User.findOne({
            handle,
          }).exec((err, user) => {
            if (err) return res.status(500).send({ message: err });
            if (user) {
              generateDataForMatch(access_token, handle);
              updateConnectionTime(handle);
            } else
              request.post(userOptions, () => {
                generateDataForMatch(access_token, handle);
              });
          });

          res.redirect(
            "http://localhost:3000/profile#" +
              querystring.stringify({
                access_token,
                refresh_token,
                user: handle,
                expires_in,
              })
          );
        });
      } else {
        res.redirect(
          "http://localhost:3000/#" +
            querystring.stringify({
              error: "Invalid token",
            })
        );
      }
    });
  }
};

exports.getMe = (req, res) => {
  const options = {
    url: "https://api.spotify.com/v1/me",
    headers: { Authorization: "Bearer " + req.query.token },
    json: true,
  };

  request.get(options, (error, response, body) => {
    res.send(body);
  });
};

exports.refreshToken = (req, res) => {
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

exports.getUser = (req, res) => {
  const token = req.headers.authorization;
  const user = req.headers.user;
  const url = `https://api.spotify.com/v1/users/${user}`;
  callSpotify(token, url).then(body => {
    res.status(200).send(body);
  });
};

getSavedTracks = token => {
  const url = "https://api.spotify.com/v1/me/tracks?limit=50";
  return new Promise(resolve => {
    callSpotify(token, url).then(body => {
      let tracks = [];
      body.items.map(item => {
        tracks.push(item.track.id);
      });

      resolve(tracks);
    });
  });
};

getAlbums = token => {
  const url = "https://api.spotify.com/v1/me/albums";
  return new Promise(resolve => {
    callSpotify(token, url).then(body => {
      let albums = [];
      let genres = [];

      body.items.map(item => {
        albums.push(item.album.id);
        genres.push(item.album.genres);
      });

      resolve({ albums, genres });
    });
  });
};

getFollowedArtists = token => {
  const url = "https://api.spotify.com/v1/me/following?type=artist";
  return new Promise(resolve => {
    callSpotify(token, url).then(body => {
      let artists = [];
      let genres = [];

      body.artists.items.map(item => {
        artists.push(item.id);
        genres.push(item.genres);
      });

      resolve({ artists, genres });
    });
  });
};

exports.recent = (req, res) => {
  User.findOne({
    handle: req.headers.handle,
  }).exec((err, user) => {
    if (err) return res.send(500).send({ error: err });
    if (!user) return res.send(401).send({ message: "Handle incorrect" });

    getTracksNames(user.match.recent, req.headers.token).then(tracks => {
      return res.status(200).send(tracks);
    });
  });
};

getTracksNames = (tracks, token) => {
  return new Promise(async resolve => {
    let tracksNames = [];

    for (let i = 0; i < tracks.length; i++) {
      const url = `https://api.spotify.com/v1/tracks/${tracks[i]}`;
      tracksNames.push(await callSpotify(token, url));
    }

    resolve(tracksNames);
  });
};

getRecentlyPlayed = token => {
  const url = "https://api.spotify.com/v1/me/player/recently-played";
  return new Promise(resolve => {
    callSpotify(token, url)
      .then(body => {
        let tracks = [];

        body.items.map(item => {
          tracks.push(item.track.id);
        });

        resolve(tracks);
      })
      .catch(err => {
        console.error(err);
      });
  });
};

exports.play = (req, res) => {
  const token = req.headers.authorization;
  const url = "https://api.spotify.com/v1/me/player/play";
  callPlayer(token, url).then(body => {
    return res.status(200).send(body);
  });
};

exports.transferPlayback = (req, res) => {
  const token = req.headers.authorization;
  const url = "https://api.spotify.com/v1/me/player";
  callSpotify(token, url).then(body => {
    res.status(200).send(body);
  });
};

exports.getCurrentlyPlaying = (req, res) => {
  const token = req.headers.authorization;
  const url = "https://api.spotify.com/v1/me/player/currently-playing";
  callSpotify(token, url).then(body => {
    if (body)
      res.status(200).send({ song: body.item.name, uri: body.item.uri });
  });
};

getPlaylists = token => {
  const url = "https://api.spotify.com/v1/me/playlists";
  return new Promise(resolve => {
    callSpotify(token, url).then(body => {
      let playlists = [];

      body.items.map(item => {
        playlists.push(item.id);
      });

      resolve(playlists);
    });
  });
};

exports.getUserPlaylists = (req, res) => {
  const token = req.headers.authorization;
  const userId = req.headers.user;
  const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
  callSpotify(token, url).then(body => {
    let playlists = [];

    body.items.map(item => {
      playlists.push(item.id);
    });

    res.status(200).send(playlists);
  });
};

getUserTops = (token, type) => {
  const url = `https://api.spotify.com/v1/me/top/${type}`;
  return new Promise(resolve => {
    callSpotify(token, url).then(body => {
      let tops = [];

      body.items.map(item => {
        tops.push(item.id);
      });

      resolve(tops);
    });
  });
};

const callSpotify = (token, url) => {
  const options = {
    url: url,
    headers: {
      Authorization: "Bearer " + token,
    },
    json: true,
  };

  return new Promise(resolve => {
    request.get(options, (err, _, body) => {
      if (err) console.error(err);
      resolve(body);
    });
  });
};

// DRY it
const callPlayer = (token, url) => {
  const options = {
    url: url,
    headers: {
      Authorization: "Bearer " + token,
    },
    json: true,
  };

  return new Promise(resolve => {
    request.put(options, (err, _, body) => {
      if (err) console.error(err);
      resolve(body);
    });
  });
};

updateConnectionTime = handle => {
  User.findOne({
    handle: handle,
  }).exec((err, user) => {
    if (err) return { message: err };
    if (!user) return { message: "Handle incorrect" };

    user.updateOne({ lastconnection: Date.now() }, (err, data) => {
      if (err) return res.status(500).send({ message: err });
      user.save();
      return data;
    });
  });
};

generateDataForMatch = async (token, handle) => {
  let tracks = await getSavedTracks(token);
  let albums = await getAlbums(token);
  let artists = await getFollowedArtists(token);
  let recent = await getRecentlyPlayed(token);
  let genres = [].concat(...albums.genres).concat(...artists.genres);

  User.findOne({
    handle: handle,
  }).exec((err, user) => {
    if (err) return { message: err };
    if (!user) return { message: "Handle incorrect" };

    const matchData = {
      handle: handle,
      tracks,
      albums: albums.albums,
      artists: artists.artists,
      recent,
      genres: [...new Set(genres)],
      matchs: [...user.match.matchs],
    };

    user.updateOne({ match: matchData }, (err, data) => {
      if (err) return res.status(500).send({ message: err });
      user.save();
      return data;
    });
  });
};
