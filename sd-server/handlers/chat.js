const db = require("../models");
const io = require("socket.io");

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
  //Search user socket id and send to specific socket
  io.compress(true).emit("newMessage", data);
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

exports.sendMessage = (req, res) => {
  let content = req.body.content;
  let to = req.body.to;
  let from = req.body.from;

  const filter = { handle: to };
  const update = {
    messages: [{ content, from, date: Date.now(), read: false }],
  };

  User.findOneAndUpdate(filter, update, (err, doc) => {
    if (err) return res.status(500).send({ message: err });

    if (!doc) return res.status(401).send({ message: "User not found" });

    doc.save();
    return res.status(200).send(doc);
  });
};

exports.getMessages = (req, res) => {
  User.findOne({
    handle: req.query.handle,
  }).exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(404).send({ message: "User not found" });

    let messages = user.messages.filter(
      msg => msg.from === req.query.from || msg.to === req.query.from
    );

    // Set read to true
    res.status(200).send(messages);
  });
};
