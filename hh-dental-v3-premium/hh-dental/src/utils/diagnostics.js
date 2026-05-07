/**
 * Socket.IO Diagnostics Utility
 * Helps troubleshoot connection issues
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL =
  API_URL ||
  (API_BASE_URL ? API_BASE_URL.replace(/\/api\/?$/, "") : "") ||
  import.meta.env.VITE_API_URL || "https://venraj-final.onrender.com";

const BACKEND_URL = SOCKET_URL;

export const socketDiagnostics = {
  async checkBackendHealth() {
    try {
      const response = await fetch(`${BACKEND_URL}/health`, {
        method: "GET",
        credentials: "include"
      });
      const data = await response.json();
      console.log("✓ Backend Health Check:", data);
      return { ok: true, data };
    } catch (error) {
      console.error("✗ Backend Health Check Failed:", error.message);
      return { ok: false, error: error.message };
    }
  },

  async checkBackendAPI() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/services`, {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      console.log("✓ Backend API is accessible");
      return { ok: true };
    } catch (error) {
      console.error("✗ Backend API Check Failed:", error.message);
      return { ok: false, error: error.message };
    }
  },

  printSocketConfig(socket) {
    console.group("🔧 Socket.IO Configuration");
    console.log("Connected:", socket.connected);
    console.log("Socket ID:", socket.id);
    console.log("Transport:", socket.io.engine.transport.name);
    console.log("Socket URL:", SOCKET_URL);
    console.log("Backend URL:", BACKEND_URL);
    console.log("Environment:", import.meta.env.MODE);
    console.groupEnd();
  },

  async runFullDiagnostics(socket) {
    console.group("🔍 Running Socket.IO Full Diagnostics");
    
    console.log("\n1️⃣  Socket Configuration:");
    this.printSocketConfig(socket);

    console.log("\n2️⃣  Backend Health Check:");
    const healthCheck = await this.checkBackendHealth();

    console.log("\n3️⃣  Backend API Check:");
    const apiCheck = await this.checkBackendAPI();

    console.log("\n4️⃣  Socket Connection Status:");
    console.log("Connected:", socket.connected);
    console.log("Disconnected:", socket.disconnected);
    
    const allPassed = healthCheck.ok && apiCheck.ok;
    console.log("\n✅ Summary:", allPassed ? "All checks passed!" : "Some checks failed. See above.");
    
    console.groupEnd();
    
    return { healthCheck, apiCheck, socketConnected: socket.connected };
  }
};

export default socketDiagnostics;
