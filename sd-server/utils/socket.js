let online = [];
let notify = [];
let io;

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
  });
};

exports.newMessage = (data) => {
  console.log(online);

  let index = online.findIndex((user) => user.handle === data.handle);
  console.log(index);
  if (index !== -1 && online[index].contact === data.contact)
    io.compress(true).to(online[index].id).emit("messaging", data);
};

exports.emitNotification = (data) => {
  let index = notify.findIndex(
    (user) => user.handle === data.fullDocument.handle
  );

  io.compress(true).to(notify[index].id).emit("notification", data);
};
