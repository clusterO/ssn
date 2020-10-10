const User = require("../schemas/user");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validators");

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
  if (!valid) return response.status(400).json(errors);

  User.create(newUser, (err, data) => {
    if (err) res.status(500).send(err);
    else res.status(201).send(data);
  });
};
