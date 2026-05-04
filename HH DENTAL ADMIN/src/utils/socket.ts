import { io, Socket } from "socket.io-client";

// In production, this should come from an environment variable
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

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
