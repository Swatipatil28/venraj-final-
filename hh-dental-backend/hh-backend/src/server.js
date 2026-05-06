require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./utils/socket");

const PORT = Number(process.env.PORT || 5001);
const HOST = process.env.HOST || "0.0.0.0";

const startServer = async () => {
  await connectDB();
  const server = http.createServer(app);

  initSocket(server);

  server.listen(5001, () => {
    console.log("✅ Server running on http://localhost:5001");
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port 5001 is already in use. Please stop the existing process.`);
      // Handle port conflict gracefully (log error only, no process.exit)
    } else {
      console.error("Server error:", err.message);
    }
  });

  const shutdown = (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err.message);
    server.close(() => process.exit(1));
  });

  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err.message);
    server.close(() => process.exit(1));
  });
};

startServer();
