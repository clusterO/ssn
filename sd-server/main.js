require("dotenv").config();

const app = require("express")();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const db = require("./models");
const dbInit = require("./utils/dbInit");
const config = require("./utils/config");
const { verifyToken } = require("./utils/util");
const {
  signUp,
  signIn,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  uploadProfileImage,
} = require("./handlers/users");
const {
  login,
  callback,
  refreshToken,
  getUser,
  getCurrentlyPlaying,
  getMe,
  play,
} = require("./handlers/spotify");
const { matchRequest, notify, subscription } = require("./handlers/matchs");
const { friends, sendMessage, getMessages } = require("./handlers/chat");

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
    console.log("DB CONNECTED");
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

io.on("connection", socket => {
  //Attach user handle to socket ID
  console.log(`${socket.request._query.handle} connected`);
});

io.on("disconnect", () => {
  console.log("user disconnected");
});

home = (req, res) => {
  res.status(200).send("SpotiDate");
};

app
  .use(cors(corsOptions))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .get("/", home)
  .get("/user/:handle", getUserDetails)
  .get("/login", login)
  .get("/callback", callback)
  .get("/refresh", refreshToken)
  .get("/artist", getUser)
  .get("/current", getCurrentlyPlaying)
  .get("/friends", friends)
  .get("/match", matchRequest)
  .get("/notify", notify)
  .get("/me", getMe)
  .get("/chat", getMessages)
  .post("/signup", signUp)
  .post("/signin", signIn)
  .post("/user", verifyToken, addUserDetails)
  .post("/user", verifyToken, uploadProfileImage)
  .post("/profile", getAuthenticatedUser)
  .post("/subscribe", subscription)
  .post("/send", sendMessage)
  .post("/play", play);

http.listen(port, console.log(`Listening on port ${port}`));
