let online = [];
let notify = [];
let io;

exports.createSocketConnection = (http) => {
  io = require("socket.io")(http);

  io.on("connection", (socket) => {
    if (socket.request._query.event === "chat")
      online.push({
        id: socket.id,
        handle: socket.request._query.handle,
      });

    if (socket.request._query.event === "notification")
      notify.push({
        id: socket.id,
        handle: socket.request._query.handle,
      });
  });

  io.on("disconnect", (socket) => {
    console.log("diss");
    let index = online.findIndex((user) => user.id === socket.id);
    online.splice(index, 1);
  });
};

exports.emitNotification = (data) => {
  let index = notify.findIndex(
    (user) => user.handle === data.fullDocument.handle
  );

  io.compress(true).to(notify[index].id).emit("notification", data);
};

exports.newMessage = (data) => {
  let index = online.findIndex((user) => user.handle === data.handle);
  io.compress(true).to(online[index].id).emit("messaging", data);
};
