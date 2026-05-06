import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

const socket = io(SOCKET_URL, {
  transports: ["polling", "websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000
});

socket.on("connect", () => {
  console.log(
    `✅ [Socket.IO] Connected! ID: ${socket.id} | Transport: ${socket.io.engine.transport.name}`
  );
});

socket.on("disconnect", (reason) => {
  console.warn(`⚠️  [Socket.IO] Disconnected - Reason: ${reason}`);
});

socket.on("connect_error", (error) => {
  console.error(`❌ [Socket.IO] Connection Error:`, error);
  if (error.message.includes("CORS")) {
    console.error("   → CORS Error detected. Check backend CORS config.");
  }
  if (error.message.includes("poll")) {
    console.error("   → Polling error detected. Backend may be unreachable.");
  }
});

socket.on("error", (error) => {
  console.error(`❌ [Socket.IO] Error:`, error);
});

export default socket;
