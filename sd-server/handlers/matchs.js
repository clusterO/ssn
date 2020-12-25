const db = require("../models");
const webpush = require("web-push");
const config = require("../utils/config");
const Match = require("../utils/match").Match;
const { v4: uuidv4 } = require("uuid");
const { emitNotification } = require("../utils/socket");

const User = db.user;

// watch notifications
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
User.watch(filter, options).on("change", (_) => {});

webpush.setVapidDetails(
  "mailto:me@gmail.com",
  config.PublicVapidKey,
  config.PrivateVapidKey
);

exports.match = (req, res) => {
  User.findOne({ handle: req.query.handle }).exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(401).send({ message: "User not found" });

    User.find().exec((err, data) => {
      if (err) return res.status(500).send({ message: err });

      if (data.length > 0) {
        let users = data.map((user) => user.match);
        let match = new Match(users, user.match, res);
        match.startScoringRoutine();
      }
    });
  });
};

exports.newHit = (req, res) => {
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

exports.getNotifications = (req, res) => {
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

exports.markNotificationsAsRead = (req, res) => {
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
