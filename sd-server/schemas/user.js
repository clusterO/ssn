import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  userId: ObjectId,
  handle: String,
  bio: String,
});

export default mongoose.model;
