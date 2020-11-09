const jwt = require("jsonwebtoken");
const config = require("./config");

exports.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) return res.status(403).send({ message: "No token provided!" });

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized!" });

    req.userId = decoded.id;
    next();
  });
};

exports.generateRandomString = length => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};
