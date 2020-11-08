const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const webpush = require("web-push");
const db = require("../models");
const config = require("../utils/config");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validators");
const io = require("socket.io");

const User = db.user;

// SocketIo with MongoDb stream Change realtime notifications
const notificationFilter = [
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

User.watch(notificationFilter, options).on("change", data => {
  io.compress(true).emit("notificationStream", data);
});

// SocketIo with MongoDb stream Change IM chat
const chatFilter = [
  {
    $match: {
      $and: [
        { "updateDescription.updatedFields.messages": { $exists: true } },
        { operationType: "update" },
      ],
    },
  },
];

User.watch(chatFilter, options).on("change", data => {
  //Search user socket id and send to specific socket
  io.compress(true).emit("newMessage", data);
});

const PublicVapidKey =
  "BKDmx4plzOXrRtpb7CHKW4huOEkckKCkNtfu50CkXeORnGSvC2L9bCg-o3vI2sL1kux90iUOdeTmAU2-1fIsTMM";
const PrivateVapidKey = "LDuSAcGDAlct5RDyGr8Rq5MPF-_A3ozFEWtkD2hUzOQ";

webpush.setVapidDetails("mailto:me@gmail.com", PublicVapidKey, PrivateVapidKey);

exports.home = (req, res) => {
  res.status(200).send("SpotiDate");
};

exports.signUp = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  const { valid, errors } = validateSignUpData(newUser);
  if (!valid) return res.status(400).json(errors);

  User.findOne({
    handle: newUser.handle,
  }).exec((err, user) => {
    if (err) return res.status(500).send({ message: err });

    if (user)
      return res
        .status(400)
        .send({ message: "Failed! Handle is already in use!" });

    newUser.password = bcrypt.hashSync(req.body.password, 8);

    User.create(newUser, (err, data) => {
      if (err) res.status(500).send(err);
      else res.status(201).send(data);
    });
  });
};

exports.signIn = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) return res.status(400).json(errors);

  User.findOne({
    email: user.email,
  }).exec((err, user) => {
    if (err) return es.status(500).send({ message: err });

    if (!user) return res.status(404).send({ message: "User not found" });

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid)
      return res.status(401).send({
        accessToken: null,
        message: "User not found",
      });

    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400,
    });

    res.status(200).send({
      id: user._id,
      handle: user.handle,
      email: user.email,
      accessToken: token,
    });
  });
};

exports.addUserDetails = (req, res) => {
  const userDetails = {
    bio: req.body.bio,
    location: req.body.location,
    website: req.body.website,
  };

  User.findOneAndUpdate({
    handle: req.body.handle,
  }).exec((err, user) => {
    if (err) return res.status(500).send({ message: err });

    user.update(userDetails, (err, data) => {
      if (err) return res.status(500).send({ message: err });
      user.save();
      return res.status(200).send(data);
    });
  });
};

exports.getAuthenticatedUser = (req, res) => {
  User.findOne({
    handle: req.body.handle,
  }).exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(404).send({ message: "User not found" });

    return res.status(200).json(user);
  });
};

exports.getUserDetails = (req, res) => {
  User.findOne({
    handle: req.params.handle,
  }).exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(404).send({ message: "User not found" });

    return res.status(200).json(user);
  });
};

exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: request.headers });

  let imageFileName;
  let imageToUpload = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png")
      return response.status(400).json({ error: "Wrong file type " });

    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    imageFileName = `${Math.round(
      Math.random() * 1000000000
    )}.${imageExtension}`;

    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToUpload = { filepath, mimetype };

    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on("finish", () => {});
  busboy.end(request.rawBody);
};

exports.addRequest = (req, res) => {
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
  let from = req.body.handle;

  const filter = { handle: to };
  const update = {
    messages: [{ content, from, date: Date.now(), read: false }],
  };

  User.findOneAndUpdate(filter, update, (err, doc) => {
    if (err) return res.status(500).send({ message: err });

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
