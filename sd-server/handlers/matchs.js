const db = require("../models");
const webpush = require("web-push");
const config = require("../utils/config");
const { v4: uuidv4 } = require("uuid");
const { emitNotification } = require("../utils/socket");

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

User.watch(filter, options).on("change", (data) => {});

webpush.setVapidDetails(
  "mailto:me@gmail.com",
  config.PublicVapidKey,
  config.PrivateVapidKey
);

exports.matchRequest = (req, res) => {
  let id = uuidv4();

  User.findOne({ handle: req.query.handle }).exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(401).send({ message: "User not found" });

    const update = {
      notifications: [
        { id, user: req.query.user, date: Date.now(), received: false },
        ...user.notifications,
      ],
    };

    user.updateOne(update, (err) => {
      if (err) return res.status(500).send({ message: err });
      user.save();
      emitNotification({ id, handle: req.query.handle, date: Date.now() });
      return res.status(200).send({ msg: "notification sent" });
    });
  });
};

//Push notification with SW
exports.subscription = (req, res) => {
  const payload = JSON.stringify({ title: "Push" });
  webpush
    .sendNotification(req.params, payload)
    .catch((err) => console.error(err));
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

exports.getCurrentUserMatch = (handle) => {
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

    users.forEach((user) => {
      matchData.push(user.match);
    });
  });
};

exports.notification = (req, res) => {
  const handle = req.query.handle;

  User.findOne({
    handle,
  }).exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(401).send({ message: "User not found" });

    let unreadNotifications = user.notifications.filter(
      (notification) => notification.received === false
    );

    res.status(200).send({
      length: unreadNotifications.length,
      notifications: unreadNotifications,
    });

    return user.save();
  });
};

exports.markNotifications = (req, res) => {
  const handle = req.query.handle;

  User.findOne({
    handle,
  }).exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(401).send({ message: "User not found" });

    user.notifications.every((notification) => {
      if (!notification.received) notification.received = true;
      else return true;
    });

    let update = { notifications: [...user.notifications] };

    user.updateOne(update, (err) => {
      if (err) return res.status(500).send({ message: err });

      res.status(200).send({ msg: "all read" });
      return user.save();
    });
  });
};
