var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const db = require("../models");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validators");

const User = db.user;

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
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Handle is already in use!" });
      return;
    }

    newUser.password = bcrypt.hashSync(req.body.password, 8);

    User.create(newUser, (err, data) => {
      if (err) res.status(500).send(err);
      else res.status(201).send(data);
    });
  });
};
