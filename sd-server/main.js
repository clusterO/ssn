const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const db = require("./models");
const dbInit = require("./utils/dbInit");
const config = require("./utils/config");
const verifyToken = require("./utils/verifyToken");
const {
  home,
  signUp,
  signIn,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  uploadImage,
} = require("./handlers/users");
const {
  login,
  callback,
  refresh_token,
  getUser,
  getCurrentlyPlaying,
} = require("./handlers/spotify");

const app = express();
const port = process.env.PORT || 8888;
const dbURL = config.connectionString;

db.mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB ==> OK");
    dbInit();
  })
  .catch(err => {
    console.error("DB connection error", err);
    process.exit();
  });

app
  .use(cors())
  .use(express.static(__dirname + "/public"))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .get("/", home)
  .post("/signup", signUp)
  .post("/signin", signIn)
  .post("/user", verifyToken, addUserDetails)
  .post("/user", verifyToken, uploadImage)
  .get("/user", verifyToken, getAuthenticatedUser)
  .get("/user/:handle", getUserDetails)
  .get("/login", login)
  .get("/callback", callback)
  .get("/refresh", refresh_token)
  .get("/artist", getUser)
  .get("/current", getCurrentlyPlaying)
  .listen(port, console.log(`Listening on port ${port}`));
