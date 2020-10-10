const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  userId: ObjectId,
  handle: String,
  email: String,
  password: String,
});

module.exports = mongoose.model("User", userSchema);
