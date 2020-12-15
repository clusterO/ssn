let io;
let online = [];

exports.createSocketConnection = (http) => {
  io = require("socket.io")(http);

  io.on("connection", (socket) => {
    online.push({
      id: socket.id,
      handle: socket.request._query.handle,
    });
  });

  io.on("disconnect", (socket) => {
    let index = online.findIndex((user) => user.id === socket.id);

    online.splice(index, 1);
  });
};

exports.emitNotification = (data) => {
  let index = online.findIndex(
    (user) => user.handle === data.fullDocument.handle
  );

  io.compress(true).to(online[index].id).emit("notificationStream", data);
};

exports.newMessage = (data) => {
  let index = online.findIndex(
    (user) => user.handle === data.fullDocument.handle
  );

  io.compress(true).to(online[index].id).emit("newMessage", data);
};
