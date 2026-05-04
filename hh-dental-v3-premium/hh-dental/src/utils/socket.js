import { io } from "socket.io-client";

// In production, this should come from an environment variable
const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Try VITE_API_URL, then VITE_API_BASE_URL (minus /api), 
// then a production fallback, finally localhost if in dev
const SOCKET_URL = VITE_API_URL || 
                   (VITE_API_BASE_URL ? VITE_API_BASE_URL.replace(/\/api$/, "") : null) || 
                   (import.meta.env.PROD ? "https://venraj-final.onrender.com" : "http://localhost:5001");

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("%c[Socket.IO] Connected to server", "color: #2E86AB; font-weight: bold;");
});

socket.on("disconnect", () => {
  console.log("%c[Socket.IO] Disconnected from server", "color: #e11d48; font-weight: bold;");
});

export default socket;
