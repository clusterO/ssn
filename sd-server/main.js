const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { signUp, home } = require("./handlers/users");

const app = express();
const port = process.env.port || 8888;
const dbURL =
  "mongodb+srv://cluster0:AJNaqQiSdkupsGKF@cluster0.zfs3r.gcp.mongodb.net/spotidate?retryWrites=true&w=majority";

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.get("/", home);
app.post("/signup", signUp);

app.listen(port, console.log(`listening on port ${port}`));
