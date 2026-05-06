const { Server } = require("socket.io");

let io;

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
];

const normalizeOrigins = (values = []) =>
  values
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

const isLocalhostOrigin = (origin) => {
  if (!origin || typeof origin !== "string") return false;
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin.trim());
};

const getAllowedOrigins = () => {
  const envOrigins = normalizeOrigins([
    process.env.FRONTEND_URL,
    process.env.ADMIN_FRONTEND_URL,
    process.env.PUBLIC_FRONTEND_URL,
    process.env.CORS_ORIGINS,
  ]);

  return [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...envOrigins])];
};

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  const normalizedOrigin = origin.trim();
  if (isLocalhostOrigin(normalizedOrigin)) return true;
  return getAllowedOrigins().includes(normalizedOrigin);
};

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: true,
      credentials: true
    },
    transports: ["polling", "websocket"],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on("connection", (socket) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`\x1b[36m[Socket.IO]\x1b[0m✓ User connected: ${socket.id} | Transport: ${socket.conn.transport.name}`);
    }

    socket.on("disconnect", (reason) => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`\x1b[33m[Socket.IO]\x1b[0m✗ User disconnected: ${socket.id} | Reason: ${reason}`);
      }
    });

    socket.on("connect_error", (error) => {
      console.error(`\x1b[31m[Socket.IO]\x1b[0m⚠ Connect error for ${socket.id}:`, error.message);
    });

    socket.on("error", (error) => {
      console.error(`\x1b[31m[Socket.IO]\x1b[0m⚠ Socket error for ${socket.id}:`, error);
    });
  });

  io.on("connect_error", (error) => {
    console.error(`\x1b[31m[Socket.IO]\x1b[0m Connection error:`, error.message);
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
  if (!io) {
    console.warn(`[Socket.IO] Skipped emit for ${event} because Socket.IO is not initialized.`);
    return false;
  }

  try {
    io.emit(event, data);
    if (process.env.NODE_ENV !== "production") {
      console.log(`\x1b[32m[Socket.IO]\x1b[0m Emitted: ${event}`);
    }
    return true;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`\x1b[31m[Socket.IO]\x1b[0m Failed to emit ${event}:`, error.message);
    }
    return false;
  }
};

module.exports = { initSocket, getIO, emitEvent, getAllowedOrigins, isAllowedOrigin };
