const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = require("../models");
const config = require("../utils/config");
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

    return res.status(200).send(user);
  });
};

exports.getUserDetails = (req, res) => {
  User.findOne({
    handle: req.params.handle,
  }).exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(404).send({ message: "User not found" });

    return res.status(200).send(user);
  });
};
