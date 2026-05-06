import { io, Socket } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL =
  API_URL ||
  (API_BASE_URL ? API_BASE_URL.replace(/\/api\/?$/, "") : "") ||
  (import.meta.env.PROD ? "https://venraj-final.onrender.com" : "http://localhost:5001");

console.log("[Socket.IO] Connecting to:", SOCKET_URL);

class SocketService {
  private static instance: SocketService;
  public socket: Socket;

  private constructor() {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
    this.socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000
    });

    this.socket.on("connect", () => {
      console.log(
        `✅ [Socket.IO] Connected! ID: ${this.socket.id} | Transport: ${
          (this.socket.io.engine.transport as any).name
        }`
      );
    });

    this.socket.on("disconnect", (reason) => {
      console.warn(`⚠️  [Socket.IO] Disconnected - Reason: ${reason}`);
    });

    this.socket.on("connect_error", (error: any) => {
      console.error(`❌ [Socket.IO] Connection Error:`, error);
      if (error.message?.includes("CORS")) {
        console.error("   → CORS Error detected. Check backend CORS config.");
      }
      if (error.message?.includes("poll")) {
        console.error("   → Polling error detected. Backend may be unreachable.");
      }
    });

    this.socket.on("error", (error) => {
      console.error(`❌ [Socket.IO] Error:`, error);
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
