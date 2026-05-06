# SOCKET.IO ERROR REFERENCE & SOLUTIONS

## Common Error Messages & Fixes

---

### 1. "CORS request did not succeed"

**Error in Console:**
```
❌ [Socket.IO] Connection Error: CORS request did not succeed
```

**Causes:**
- Backend not running
- Wrong backend URL
- Port 5001 blocked by firewall
- CORS not properly configured

**Solutions:**

```bash
# 1. Verify backend is running
curl http://localhost:5001/health
# Should return: {"success": true, "message": "API is healthy"}

# 2. Check if port is in use
netstat -ano | findstr :5001
# If in use, kill it:
taskkill /PID <PID> /F

# 3. Clear browser cache
# Press Ctrl+Shift+R to hard refresh
```

**In Code:**
```javascript
// Verify socket URL is correct
console.log("Socket URL:", SOCKET_URL);
// Should be: http://localhost:5001

// Check .env.local
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
// Should be: http://localhost:5001
```

---

### 2. "xhr poll error"

**Error in Console:**
```
❌ [Socket.IO] Connection Error: xhr poll error
   → Polling error detected. Backend may be unreachable.
```

**Causes:**
- Polling transport blocked
- Backend API endpoint not responding
- Network issues between frontend and backend
- Incorrect CORS headers

**Solutions:**

```bash
# 1. Test polling endpoint directly
curl -X GET http://localhost:5001/socket.io/?transport=polling
# Should return 200 OK

# 2. Check CORS headers
curl -I -X OPTIONS http://localhost:5001/socket.io/ \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET"

# 3. Check network throttling
# In DevTools: Network → Throttling → No throttling

# 4. Verify backend CORS config
# Check: hh-dental-backend/src/app.js line 25-40
```

**Expected CORS Headers:**
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST
```

---

### 3. "Connection timeout"

**Error in Console:**
```
⚠️  [Socket.IO] Connection Error: Connection timeout
```

**Causes:**
- Backend taking too long to respond
- Network latency
- Backend processing request slowly
- Firewall delay

**Solutions:**

```javascript
// 1. Increase timeout in socket config
const socket = io(SOCKET_URL, {
  timeout: 30000,  // Increase from 20000 to 30000
  reconnectionDelay: 2000  // Give more time between retries
});

// 2. Check backend response time
// In backend logs, look for slow operations
// Check database connection issues

// 3. Monitor network in DevTools
// Network tab → XHR filter
// Check response time for socket.io requests
```

---

### 4. "Engine.IO failed to be compatible with Socket.IO"

**Error in Console:**
```
❌ [Socket.IO] Connection Error: Engine.IO failed to be compatible
```

**Causes:**
- Socket.IO version mismatch between client and server
- Backend socket.io version differs from frontend

**Solutions:**

```bash
# Check versions
# Frontend: grep "socket.io-client" hh-dental-v3-premium/hh-dental/package.json
# Backend: grep "socket.io" hh-dental-backend/hh-backend/package.json

# They should match! Example:
# Frontend: "socket.io-client": "^4.5.0"
# Backend: "socket.io": "^4.5.0"

# If not matching, update both:
cd backend && npm install socket.io@latest
cd ../frontend && npm install socket.io-client@latest
```

---

### 5. "WebSocket connection failed"

**Error in Console:**
```
⚠️  [Socket.IO] Disconnected - Reason: transport error
```

**Causes:**
- WebSocket port blocked (usually 5001)
- Firewall/VPN blocking WebSocket
- Backend not listening on correct port
- Nginx/reverse proxy misconfiguration

**Solutions:**

```bash
# 1. Verify backend listening on all interfaces
# In hh-dental-backend/hh-backend/src/server.js
# Should show: Server running on http://localhost:5001

# 2. Check if port is really listening
netstat -an | findstr LISTENING | findstr 5001

# 3. Try fallback to polling only
const socket = io(SOCKET_URL, {
  transports: ["polling"]  // Disable websocket temporarily
});

# 4. Check firewall rules
# Allow port 5001 for both TCP and WebSocket traffic
```

---

### 6. "Polling blocked by CORS"

**Error in Console:**
```
❌ [Socket.IO] xhr poll error
   Status: 403 Forbidden
   Response: "CORS request did not succeed"
```

**Causes:**
- Backend CORS not allowing the origin
- Missing credentials in request
- Backend not configured for polling

**Solutions:**

```javascript
// 1. Verify frontend has credentials
const socket = io(SOCKET_URL, {
  withCredentials: true  // CRITICAL - must be true
});

// 2. Verify backend CORS config
// File: hh-dental-backend/hh-backend/src/app.js
app.use(cors({
  credentials: true,  // Must be true
  origin: (origin, callback) => {
    // Accept all localhost
    if (origin?.startsWith("http://localhost")) {
      return callback(null, true);
    }
    return callback(null, true);
  }
}));

// 3. Verify Socket.IO CORS
// File: hh-dental-backend/hh-backend/src/utils/socket.js
cors: {
  credentials: true,  // Must be true
  origin: true  // or custom function
}
```

---

### 7. "Blank UI / Data Not Loading"

**Error:**
- Page loads but no content visible
- Socket connection might be working but data doesn't appear

**Troubleshooting:**

```javascript
// In browser console:
console.log("Socket connected?", socket.connected);
// Should be: true

console.log("Socket ID:", socket.id);
// Should show a UUID like: abc123def456...

console.log("Transport:", socket.io.engine.transport.name);
// Should be: "websocket" or "polling"

// Check if event listeners are working
socket.on("test-event", (data) => {
  console.log("Event received:", data);
});

socket.emit("test-event", {message: "Hello"});
```

**Solutions:**

```javascript
// 1. Verify API calls are working
fetch("http://localhost:5001/api/services")
  .then(r => r.json())
  .then(data => console.log("API data:", data))
  .catch(e => console.error("API error:", e));

// 2. Check React component mounting
// Add console.log in useEffect hooks
useEffect(() => {
  console.log("Component mounted, fetching data...");
  // fetch data
}, []);

// 3. Check for JavaScript errors
// Press F12 → Console tab
// Look for red error messages
```

---

### 8. "Reconnect Loop / Too Many Retries"

**Error:**
```
⚠️  [Socket.IO] Disconnected - Reason: client namespace disconnect
⚠️  [Socket.IO] Disconnected - Reason: transport close
```
*Message repeats continuously*

**Causes:**
- Backend crashing frequently
- Network unstable
- Too many reconnection attempts causing load

**Solutions:**

```javascript
// 1. Reduce reconnection attempts and delays
const socket = io(SOCKET_URL, {
  reconnectionAttempts: 5,    // Reduce from 10
  reconnectionDelay: 2000,    // Increase from 1000
  reconnectionDelayMax: 8000  // Add max delay
});

// 2. Add reconnection event handlers
socket.on("reconnect_attempt", () => {
  console.log("Attempting to reconnect...");
  // Could show user a loading indicator
});

socket.on("reconnect", () => {
  console.log("✅ Reconnected!");
  // Refresh data when reconnected
});

// 3. Check backend health
// Look at backend logs for errors
// Ensure database is accessible
// Check for memory leaks in backend
```

---

### 9. "Credentials are not included"

**Error in Console:**
```
⚠️ The credentials mode of requests is 'include', but the 
   'Access-Control-Allow-Credentials' header was false.
```

**Solution:**

```javascript
// Frontend socket config MUST have:
const socket = io(SOCKET_URL, {
  withCredentials: true  // Enable credentials
});

// Backend CORS config MUST have:
app.use(cors({
  credentials: true  // Enable credentials
}));

// Backend Socket.IO config MUST have:
cors: {
  credentials: true  // Enable credentials
}
```

---

### 10. "Port Already In Use"

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5001
```

**Solution:**

```bash
# Windows: Find process using port 5001
netstat -ano | findstr :5001
# Output example:
#   TCP    127.0.0.1:5001    LISTENING    12345

# Kill that process
taskkill /PID 12345 /F

# Or change backend port in:
# hh-dental-backend/hh-backend/src/server.js
const PORT = Number(process.env.PORT || 5002);  // Change 5001 to 5002
```

---

## 🔧 DIAGNOSTIC COMMANDS

### Test Backend Connectivity
```bash
curl -v http://localhost:5001/health
curl -v http://localhost:5001/api/services
```

### Check All Ports
```bash
# Windows
netstat -ano | findstr LISTENING

# macOS/Linux
lsof -i -P -n | grep LISTEN
```

### Enable Debug Logging
```javascript
// In frontend:
const socket = io(SOCKET_URL, {
  transports: ["polling", "websocket"],
  withCredentials: true
});

// Monitor all events
socket.onAny((event, ...args) => {
  console.log("EVENT:", event, args);
});
```

---

## 📞 WHEN ALL ELSE FAILS

### Complete Reset
```bash
# 1. Kill all Node processes
taskkill /F /IM node.exe

# 2. Clear caches
rm -rf hh-dental-backend/hh-backend/node_modules
rm -rf hh-dental-v3-premium/hh-dental/node_modules
rm -rf "HH DENTAL ADMIN/node_modules"

# 3. Reinstall
cd hh-dental-backend/hh-backend && npm install
cd ../../hh-dental-v3-premium/hh-dental && npm install
cd "../../HH DENTAL ADMIN" && npm install

# 4. Clear browser cache
# Ctrl+Shift+R in all browsers

# 5. Start fresh
npm run dev  # in each folder
```

### Check Logs
```bash
# Backend logs show in terminal running "npm run dev"
# Look for:
# ✓ [Socket.IO]✓ User connected: <id>
# [Socket.IO] Emitted: <event>

# Frontend logs in browser DevTools Console
# Look for:
# ✅ [Socket.IO] Connected!
# ✓ Backend Health Check: {success: true}
```

---

## ✅ SUCCESS INDICATORS

When everything is working, you should see:

**In Browser Console:**
```
[Socket.IO] Connecting to: http://localhost:5001
✅ [Socket.IO] Connected! ID: abc123... | Transport: websocket
```

**In Backend Terminal:**
```
[Socket.IO]✓ User connected: abc123... | Transport: websocket
```

**In Network Tab (DevTools):**
- No red 403/CORS errors
- WebSocket connection showing "101 Switching Protocols"
- Quick response times (< 100ms)

---

**Created by: Senior MERN + Socket.IO Engineer**
**Last Updated: May 5, 2026**
