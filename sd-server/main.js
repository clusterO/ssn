const app = require("express")();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http").createServer(app);

const db = require("./models");
const dbInit = require("./utils/dbInit");
const config = require("./utils/config");
const { verifyToken, upload } = require("./utils/util");
const {
  signUp,
  signIn,
  addUserDetails,
  getAuthenticatedUser,
} = require("./handlers/users");
const {
  login,
  callback,
  refreshToken,
  getUser,
  getCurrentlyPlaying,
  getMe,
  play,
  pause,
  recent,
} = require("./handlers/spotify");
const {
  matchRequest,
  notification,
  subscription,
  markNotifications,
} = require("./handlers/matchs");
const {
  friends,
  sendMessage,
  getMessages,
  react,
  requestCall,
} = require("./handlers/chat");
const { xazam } = require("./handlers/xazam");
const { createSocketConnection } = require("./utils/socket");

const port = process.env.PORT;
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
  .catch((err) => {
    console.error("DB connection error", err);
    process.exit();
  });

createSocketConnection(http);

let corsOptions = {
  origin: "https://spotidate-bdd25.web.app",
  credentials: true,
};

home = (req, res) => {
  res.status(200).send("welcome home!");
};

app
  .use(cors(corsOptions))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .get("/", home)
  .get("/login", login)
  .get("/callback", callback)
  .get("/refresh", refreshToken)
  .get("/artist", getUser)
  .get("/current", getCurrentlyPlaying)
  .get("/friends", friends)
  .get("/match", matchRequest)
  .get("/notification", notification)
  .get("/mark", markNotifications)
  .get("/me", getMe)
  .get("/chat", getMessages)
  .get("/recent", recent)
  .post("/signup", signUp)
  .post("/signin", signIn)
  .post("/user", verifyToken, addUserDetails)
  .post("/upload", verifyToken, upload)
  .post("/profile", getAuthenticatedUser)
  .post("/subscribe", subscription)
  .post("/send", sendMessage)
  .post("/request", requestCall)
  .post("/react", react)
  .post("/play", play)
  .post("/pause", pause)
  .post("/xazam", xazam);

http.listen(port, console.log(`Listening on port ${port}`));
