const db = require("../models");

let online = [];
let notify = [];
let io;

const User = db.user;

exports.createSocketConnection = (http) => {
  io = require("socket.io")(http);

  io.on("connection", (socket) => {
    if (socket.request._query.event === "chat") {
      let index = online.findIndex(
        (user) => user.handle === socket.request._query.handle
      );

      if (index !== -1) online.splice(index, 1);

      online.push({
        id: socket.id,
        handle: socket.request._query.handle,
        contact: socket.request._query.contact,
      });
    }

    if (socket.request._query.event === "notification") {
      let index = notify.findIndex(
        (user) => user.handle === socket.request._query.handle
      );

      if (index !== -1) notify.splice(index, 1);

      notify.push({
        id: socket.id,
        handle: socket.request._query.handle,
      });
    }

    socket.on("disconnect", (socket) => {
      let index = online.findIndex((user) => user.id === socket.id);
      if (index !== -1) online.splice(index, 1);
    });

    socket.on("notification", (handle) => {
      let index = notify.findIndex((user) => user.handle === handle);
      if (index !== -1) notify.splice(index, 1);
    });

    socket.on("request", (response) => {
      let index = online.findIndex((user) => user.handle === response.contact);

      if (index !== -1 && online[index].contact === response.handle) {
        if (response.action === "accept")
          io.compress(true).to(online[index].id).emit("play");

        if (response.action === "reject")
          io.compress(true).to(online[index].id).emit("reject");
      }
    });
  });
};

exports.newMessage = (data) => {
  let index = online.findIndex((user) => user.handle === data.handle);

  if (index !== -1 && online[index].contact === data.contact)
    io.compress(true).to(online[index].id).emit("messaging", data);
};

exports.callRequest = (data) => {
  let index = online.findIndex((user) => user.handle === data.handle);

  if (index !== -1 && online[index].contact === data.contact)
    io.compress(true).to(online[index].id).emit("calling", data);
};

exports.emitNotification = (data) => {
  let index = notify.findIndex((user) => user.handle === data.handle);

  if (index !== -1) {
    io.compress(true).to(notify[index].id).emit("notification", data);

    User.findOne({ handle: data.handle }).exec((err, user) => {
      if (err) console.error({ message: err });
      if (!user) console.error({ message: "User not found" });

      let index = user.notifications.findIndex(
        (notification) => notification.id === data.id
      );

      if (index !== -1) {
        user.notifications[index].received = true;

        const update = {
          notifications: [...user.notifications],
        };

        user.updateOne(update, (err) => {
          user.save();
        });
      }
    });
  }
};
