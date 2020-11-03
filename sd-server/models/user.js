const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = mongoose.model(
  "User",
  new Schema({
    userId: ObjectId,
    handle: String,
    email: String,
    password: String,
    bio: String,
    location: String,
    website: String,
    match: Object,
    notifications: Array,
    lastconnection: Date,
  })
);

module.exports = User;
