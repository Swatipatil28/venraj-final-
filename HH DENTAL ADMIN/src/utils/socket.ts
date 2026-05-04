import { io, Socket } from "socket.io-client";

// In production, this should come from an environment variable
const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Try VITE_API_URL, then VITE_API_BASE_URL (minus /api), 
// then a production fallback, finally localhost if in dev
const SOCKET_URL = VITE_API_URL || 
                   (VITE_API_BASE_URL ? VITE_API_BASE_URL.replace(/\/api$/, "") : null) || 
                   (import.meta.env.PROD ? "https://venraj-final.onrender.com" : "http://localhost:5001");

class SocketService {
  private static instance: SocketService;
  public socket: Socket;

  private constructor() {
    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("%c[Socket.IO] Connected to server", "color: #2E86AB; font-weight: bold;");
    });

    this.socket.on("disconnect", () => {
      console.log("%c[Socket.IO] Disconnected from server", "color: #e11d48; font-weight: bold;");
    });

    this.socket.on("connect_error", (error) => {
      console.error("[Socket.IO] Connection Error:", error);
    });
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }
}

export const socketService = SocketService.getInstance();
export const socket = socketService.socket;
