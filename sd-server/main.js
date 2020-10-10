const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const db = require("./models");
const dbInit = require("./utils/dbInit");
const config = require("./utils/config");
const { signUp, home } = require("./handlers/users");

const app = express();
const port = process.env.PORT || 8888;
const dbURL = config.connectionString;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get("/", home);
app.post("/signup", signUp);

app.listen(port, console.log(`Listening on port ${port}`));
