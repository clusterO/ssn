const db = require("../models");
const { newMessage } = require("../utils/socket");
const { v4: uuidv4 } = require("uuid");

const User = db.user;

// SocketIo with MongoDb stream Change IM chat
const filter = [
  {
    $match: {
      $and: [
        { "updateDescription.updatedFields.messages": { $exists: true } },
        { operationType: "update" },
      ],
    },
  },
];

const options = { fullDocument: "updateLookup" };

User.watch(filter, options).on("change", data => {
  newMessage(data);
});

exports.friends = (req, res) => {
  User.findOne({
    handle: req.query.handle,
  }).exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(404).send({ message: "User not found" });

    return res.status(200).json(user.friends);
  });
};

exports.react = (req, res) => {
  // Update
  User.findOne({ handle: to }).exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(401).send({ message: "User not found" });

    let index = user.messages.findIndex(message => message.id === req.body.id);

    if (index) user.messages[index].reaction = req.body.reaction;
    user.save();
  });

  User.findOne({ handle: from }).exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(401).send({ message: "User not found" });

    let index = user.messages.findIndex(message => message.id === req.body.id);

    if (index) user.messages[index].reaction = req.body.reaction;
    user.save();
  });

  return res.status(200).send({ message: "reaction updated" });
};

exports.sendMessage = (req, res) => {
  let content = req.body.content;
  let to = req.body.to;
  let from = req.body.from;
  let id = uuidv4();

  User.findOne({ handle: to }).exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(401).send({ message: "User not found" });

    const update = {
      messages: [
        { id, content, from, date: Date.now(), read: false },
        ...user.messages,
      ],
    };

    user.updateOne(update, (err, data) => {
      if (err) return res.status(500).send({ message: err });
      user.save();
    });
  });

  User.findOne({ handle: from }).exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(401).send({ message: "User not found" });

    let index = user.friends.findIndex(friend => friend.handle === to);

    if (index) user.friends[index].message = content;

    const update = {
      messages: [
        { id, content, to, date: Date.now(), read: false },
        ...user.messages,
      ],
      friends: [...user.friends],
    };

    user.updateOne(update, (err, data) => {
      if (err) return res.status(500).send({ message: err });
      user.save();
      return res.status(200).send(data);
    });
  });
};

exports.getMessages = (req, res) => {
  let messages = [];

  User.findOne({
    handle: req.query.handle,
  }).exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(404).send({ message: "User not found" });

    if (user.messages)
      messages = user.messages.filter(
        msg => msg.from === req.query.from || msg.to === req.query.from
      );

    // Set read to true
    res.status(200).send(messages);
  });
};
