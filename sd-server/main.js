import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const dbURL =
  "mongodb+srv://cluster0:AJNaqQiSdkupsGKF@cluster0.zfs3r.gcp.mongodb.net/spotidate?retryWrites=true&w=majority";
const app = express();
const port = process.env.port || 8888;

//app.use(express.json);
//app.use(express.urlencoded);
app.use(cors());

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app
  .get("/", (req, res) => {
    res.status(200).send("Alright!");
  })
  .listen(port, console.log(`listening on port ${port}`));
