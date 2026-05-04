const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`\x1b[36m[Socket.IO]\x1b[0m User connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`\x1b[33m[Socket.IO]\x1b[0m User disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    console.warn("Socket.io not initialized!");
  }
  return io;
};

const emitEvent = (event, data) => {
  if (io) {
    io.emit(event, data);
    console.log(`\x1b[32m[Socket.IO]\x1b[0m Emitted: ${event}`);
  }
};

module.exports = { initSocket, getIO, emitEvent };
