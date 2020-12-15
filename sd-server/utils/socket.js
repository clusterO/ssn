let online = [];
let socket;

exports.createSocketConnection = (http) => {
  let io = require("socket.io")(http);

  io.on("connection", (so) => {
    socket = so;

    online.push({
      id: socket.id,
      handle: socket.request._query.handle,
    });
  });

  io.on("disconnect", (so) => {
    console.log("diss");
    let index = online.findIndex((user) => user.id === so.id);
    online.splice(index, 1);
  });
};

exports.emitNotification = (data) => {
  let index = online.findIndex(
    (user) => user.handle === data.fullDocument.handle
  );

  socket.broadcast
    .compress(true)
    .to(online[index].id)
    .emit("notification", data);
};

exports.newMessage = (data) => {
  let index = online.findIndex(
    (user) => user.handle === data.fullDocument.handle
  );

  socket.broadcast.compress(true).to(online[index].id).emit("messaging", data);
};
