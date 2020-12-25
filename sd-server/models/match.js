const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Match = mongoose.model(
  "Match",
  new Schema({
    handle: String,
    tracks: Array,
    albums: Array,
    artists: Array,
    recent: Array,
    genres: Array,
    matchs: Array,
  })
);

module.exports = Match;
