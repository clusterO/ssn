let online = [];
let notify = [];
let io;

exports.createSocketConnection = (http) => {
  io = require("socket.io")(http);

  io.on("connection", (socket) => {
    if (socket.request._query.event === "chat") {
      disconnectUserSocket(online, socket.request._query.handle);

      online.push({
        id: socket.id,
        handle: socket.request._query.handle,
        contact: socket.request._query.contact,
      });
    }

    if (socket.request._query.event === "notification") {
      disconnectUserSocket(notify, socket.request._query.handle);

      notify.push({
        id: socket.id,
        handle: socket.request._query.handle,
      });
    }

    socket.on("disconnect", (socket) => {
      let index = online.findIndex((user) => user.id === socket.id);
      if (index) online.splice(index, 1);
    });
  });
};

disconnectUserSocket = (socket, handle) => {
  let index = socket.findIndex((user) => user.handle === handle);
  if (index) socket.splice(index, 1);
};

exports.emitNotification = (data) => {
  let index = notify.findIndex(
    (user) => user.handle === data.fullDocument.handle
  );

  io.compress(true).to(notify[index].id).emit("notification", data);
};

exports.newMessage = (data) => {
  let index = online.findIndex((user) => user.handle === data.handle);

  if (index && online[index].contact === data.contact)
    io.compress(true).to(online[index].id).emit("messaging", data);
};
