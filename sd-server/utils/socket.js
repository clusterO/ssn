let io;

exports.createSocketConnection = http => {
  io = require("socket.io")(http);

  io.on("connection", socket => {
    //Attach user handle to socket ID
    console.log(`${socket.request._query.handle} connected`);
  });

  io.on("disconnect", socket => {
    console.log(`${socket.request._query.handle} disconnected`);
  });
};

//Search user socket id and send to specific socket
exports.emitNotification = data => {
  io.compress(true).emit("notificationStream", data);
};

exports.newMessage = data => {
  io.compress(true).emit("newMessage", data);
};
