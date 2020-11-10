let io;

exports.createSocketConnection = http => {
  io = require("socket.io")(http);

  io.on("connection", socket => {
    //Attach user handle to socket ID
    console.log(`${socket.request._query.handle} connected`);
  });

  io.on("disconnect", () => {
    console.log("user disconnected");
  });
};

exports.emitNotification = data => {
  io.compress(true).emit("notificationStream", data);
};
