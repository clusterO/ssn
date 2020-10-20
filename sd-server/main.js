const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

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
  getMe,
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

let corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app
  .use(cors(corsOptions))
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
  .post("/me", getMe)
  .get("/current", getCurrentlyPlaying)
  .listen(port, console.log(`Listening on port ${port}`));
