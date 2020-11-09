const db = require("../models");
const webpush = require("web-push");
const io = require("socket.io");
const config = require("../utils/config");

const User = db.user;

// SocketIo with MongoDb stream Change realtime notifications
const filter = [
  {
    $match: {
      $and: [
        { "updateDescription.updatedFields.notifications": { $exists: true } },
        { operationType: "update" },
      ],
    },
  },
];
const options = { fullDocument: "updateLookup" };

User.watch(filter, options).on("change", data => {
  io.compress(true).emit("notificationStream", data);
});

webpush.setVapidDetails(
  "mailto:me@gmail.com",
  config.PublicVapidKey,
  config.PrivateVapidKey
);

exports.matchRequest = (req, res) => {
  const filter = { handle: req.params.handle };
  const update = {
    notifications: [{ user: req.params.handle, date: Date.now() }],
  };

  User.findOneAndUpdate(filter, update, (err, doc) => {
    if (err) return res.status(500).send({ message: err });

    doc.save();
    return res.status(200).send(doc);
  });
};

//Push notification with SW
exports.subscription = (req, res) => {
  const payload = JSON.stringify({ title: "Push" });
  webpush
    .sendNotification(req.params, payload)
    .catch(err => console.error(err));
};

// Dead : Pusher beams
pusher = () => {
  let Pusher = require("pusher");
  let pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
  });

  pusher.trigger(
    "notifications",
    "someone_interested",
    { data: "any" },
    req.headers["x-socket-id"]
  );
};
// Dead

exports.getCurrentUserMatch = handle => {
  User.findOne({
    handle,
  }).exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    return user.match;
  });
};

exports.getUsersMatchData = () => {
  let matchData = [];

  User.find().exec((err, users) => {
    if (err) return console.error(err);

    users.forEach(user => {
      matchData.push(user.match);
    });
  });
};

exports.notify = (req, res) => {
  const handle = req.params.handle;

  User.findOne({
    handle,
  }).exec((err, user) => {
    if (err) return res.status(500).send({ message: err });

    res.status(200).send({ length: user.notifications.length });
    user.notifications = [];
    return user.save();
  });
};
