# Socket.IO Architecture - HH DENTAL

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER (Browsers)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Admin Panel (Port 5173)      │  V3-Premium (Port 5174)     │  │
│  │  ─────────────────────────────────────────────────────────  │  │
│  │  - React App                  │  - React App                │  │
│  │  - socket.io-client           │  - socket.io-client         │  │
│  │  - withCredentials: true      │  - withCredentials: true    │  │
│  │  - transports: polling,ws     │  - transports: polling,ws   │  │
│  │                               │                             │  │
│  │  .env.local:                  │  .env.local:                │  │
│  │  VITE_API_URL=localhost:5001  │  VITE_API_URL=localhost:5001│  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             ▼ ▼                                     │
│                     Socket + HTTP                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                ▼▼▼
                    CORS Headers + Credentials
                    ──────────────────────────
                   Transport: websocket/polling
                                ▼▼▼
┌─────────────────────────────────────────────────────────────────────┐
│                       BACKEND LAYER (Node.js)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Express Server (Port 5001)                                 │  │
│  │  ──────────────────────────────────────────────────────────  │  │
│  │                                                              │  │
│  │  ┌────────────────┐    ┌──────────────────────────────────┐ │  │
│  │  │  CORS Layer    │    │    Socket.IO Server             │ │  │
│  │  ├────────────────┤    ├──────────────────────────────────┤ │  │
│  │  │ credentials: ✓ │    │ cors.origin: (origin) => true   │ │  │
│  │  │ allow localhost│    │ transports: [polling, websocket]│ │  │
│  │  │ allow all      │    │ pingTimeout: 60000              │ │  │
│  │  │ credentials: ✓ │    │ pingInterval: 25000             │ │  │
│  │  └────────────────┘    │ connectionStateRecovery: ✓      │ │  │
│  │                        └──────────────────────────────────┘ │  │
│  │                                                              │  │
│  │  ┌────────────────┐    ┌──────────────────────────────────┐ │  │
│  │  │  API Routes    │    │    Database Layer              │ │  │
│  │  ├────────────────┤    ├──────────────────────────────────┤ │  │
│  │  │ /health        │    │ MongoDB Connection             │ │  │
│  │  │ /api/services  │    │ Collections: Services,         │ │  │
│  │  │ /api/doctors   │    │ Appointments, Doctors, etc.    │ │  │
│  │  │ /api/clinics   │    │                                │ │  │
│  │  └────────────────┘    └──────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Connection Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: CLIENT INITIALIZATION                                │
└─────────────────────────────────────────────────────────────────┘

1. Frontend loads (5173 or 5174)
   ↓
2. Import socket.js
   • Read VITE_API_URL from .env.local
   • Set SOCKET_URL = "http://localhost:5001"
   ↓
3. const socket = io(SOCKET_URL, {...options...})
   ↓
4. Attempt connection:
   a) Try WebSocket first (ws://localhost:5001)
      └─ If blocked → fallback to polling
   b) Try HTTP Long-Polling
      └─ GET/POST requests to /socket.io/?transport=polling
   ↓
5. Send CORS preflight request (OPTIONS)
   ↓
6. Backend responds with CORS headers
   ↓
7. Establish connection ✅

┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: AUTHENTICATED CONNECTION                             │
└─────────────────────────────────────────────────────────────────┘

1. Frontend socket.on("connect")
   • Log: ✅ Connected with ID
   • Store socket ID
   ↓
2. Backend io.on("connection")
   • Log: [Socket.IO]✓ User connected
   • Create socket session
   ↓
3. Setup event listeners
   socket.on("appointment:updated", handler)
   socket.on("service:created", handler)
   ↓
4. Ready for bidirectional communication ✅

┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: REAL-TIME DATA SYNC                                  │
└─────────────────────────────────────────────────────────────────┘

User Action → Frontend → Emit Event → Backend
                                        ↓
                                    Process
                                    Update DB
                                        ↓
User Action ← Frontend ← Broadcast Event ← Backend
(all clients get update)

Example:
1. User creates appointment in Admin
2. Frontend: socket.emit("appointment:create", data)
3. Backend: Saves to DB, validates
4. Backend: io.emit("appointment:created", newData)
5. All frontends receive update → UI updates
6. No manual refresh needed ✅

┌─────────────────────────────────────────────────────────────────┐
│  PHASE 4: RECONNECTION (Network Issue)                         │
└─────────────────────────────────────────────────────────────────┘

Network Drops
   ↓
Socket.IO detects disconnect (within pingInterval)
   ↓
socket.on("disconnect", reason)
   • Log: Disconnected
   ↓
Attempt Reconnection (exponential backoff)
   • Attempt 1: 1s delay
   • Attempt 2: 2s delay  
   • Attempt 3: 3s delay
   • ...
   • Attempt 10: 5s delay
   ↓
Connection Restored ✅
   • Connection state recovered
   • Missed events replayed (if configured)
   • socket.on("reconnect") triggered
   • UI reflects latest data
```

---

## Transport Priority & Fallback

```
┌─────────────────────────────────────────────────────────────────┐
│  Socket.IO Transport Negotiation                               │
└─────────────────────────────────────────────────────────────────┘

Frontend Configuration:
transports: ["polling", "websocket"]
            (order matters!)

Connection Attempt:
┌─ Try WebSocket First ────────────┐
│ ws://localhost:5001              │
│ - Bidirectional                  │
│ - Low latency                    │
│ - Real-time updates             │
│ - Best performance              │
│ ✅ Preferred                     │
└─────────────────────────────────┘
           ↓
      Blocked?
      Yes ↓
┌─ Fallback: HTTP Long-Polling ───┐
│ GET /socket.io/?transport=polling│
│ - Works through proxies          │
│ - Works with aggressive firewalls│
│ - Higher latency                 │
│ - Polling overhead              │
│ ⚠️ Fallback                      │
└─────────────────────────────────┘

✅ If either works → Connection successful
❌ If both fail → Connection error
```

---

## Header Flow for CORS

```
┌─ CLIENT REQUEST ──────────────────────────────────────────┐
│  OPTIONS /socket.io/?transport=polling                   │
│  Host: localhost:5001                                    │
│  Origin: http://localhost:5173                           │  ← Critical!
│  Access-Control-Request-Method: GET                      │
│  Access-Control-Request-Headers: content-type            │
└─────────────────────────────────────────────────────────────┘
                        ↓↓↓
                    CORS Check
                        ↓↓↓
┌─ SERVER RESPONSE ─────────────────────────────────────────┐
│  200 OK                                                   │
│  Access-Control-Allow-Origin: http://localhost:5173    │  ← Match!
│  Access-Control-Allow-Credentials: true                │  ← Required!
│  Access-Control-Allow-Methods: GET, POST, OPTIONS      │  ← Required!
│  Access-Control-Allow-Headers: content-type, ...       │  ← Required!
│  Access-Control-Max-Age: 86400                         │
└─────────────────────────────────────────────────────────────┘
                        ↓↓↓
              Connection Established! ✅
```

---

## Configuration Checklist Diagram

```
FRONTEND CHECKLIST
  │
  ├─ ✅ socket.io-client installed
  ├─ ✅ SOCKET_URL = VITE_API_URL || "http://localhost:5001"
  ├─ ✅ io(SOCKET_URL, {options})
  │   ├─ ✅ transports: ["polling", "websocket"]
  │   ├─ ✅ withCredentials: true
  │   ├─ ✅ reconnection: true
  │   ├─ ✅ reconnectionAttempts: 10
  │   ├─ ✅ reconnectionDelay: 1000
  │   ├─ ✅ reconnectionDelayMax: 5000
  │   └─ ✅ timeout: 20000
  ├─ ✅ socket.on("connect", handler)
  ├─ ✅ socket.on("disconnect", handler)
  ├─ ✅ socket.on("connect_error", handler)
  └─ ✅ .env.local exists with VITE_API_URL

BACKEND CHECKLIST
  │
  ├─ ✅ socket.io installed
  ├─ ✅ http.createServer(app)
  ├─ ✅ initSocket(server)
  ├─ ✅ CORS configuration
  │   ├─ ✅ cors: credentials: true
  │   ├─ ✅ cors: origin accepts localhost
  │   └─ ✅ cors: methods: ["GET", "POST"]
  ├─ ✅ Socket.IO server config
  │   ├─ ✅ cors: {origin: true, credentials: true}
  │   ├─ ✅ transports: ["polling", "websocket"]
  │   ├─ ✅ pingTimeout: 60000
  │   ├─ ✅ pingInterval: 25000
  │   └─ ✅ connectionStateRecovery enabled
  ├─ ✅ io.on("connection", handler)
  ├─ ✅ io.on("connect_error", handler)
  └─ ✅ PORT environment variable set (5001)

ENVIRONMENT CHECKLIST
  │
  ├─ ✅ Backend running on localhost:5001
  ├─ ✅ Admin frontend on localhost:5173
  ├─ ✅ V3-premium on localhost:5174
  ├─ ✅ .env.local exists in both frontends
  ├─ ✅ VITE_API_URL = http://localhost:5001
  ├─ ✅ No other services blocking ports
  └─ ✅ Network connectivity verified
```

---

## Error Decision Tree

```
Socket Connection Failed?
   │
   ├─ Check: Is backend running?
   │  ├─ YES → Continue
   │  └─ NO → Start backend (npm run dev)
   │
   ├─ Check: Can you access http://localhost:5001/health?
   │  ├─ YES → Continue
   │  └─ NO → Backend connection issue
   │         └─ Check firewall, port conflicts
   │
   ├─ Check: Does console show "CORS error"?
   │  ├─ YES → CORS configuration issue
   │  │       ├─ Verify credentials: true in backend
   │  │       └─ Verify origin allowed
   │  └─ NO → Continue
   │
   ├─ Check: Does console show "xhr poll error"?
   │  ├─ YES → Polling blocked
   │  │       ├─ Verify backend CORS
   │  │       └─ Check proxy settings
   │  └─ NO → Continue
   │
   ├─ Check: Console shows "websocket failed"?
   │  ├─ YES → WebSocket blocked (firewall/proxy)
   │  │       └─ Fallback to polling working? ✅
   │  └─ NO → Continue
   │
   ├─ Check: Socket.connected === true?
   │  ├─ YES → Connected! ✅
   │  └─ NO → Continue troubleshooting
   │         └─ Check browser dev tools → Network tab
   │
   └─ Still failing?
      └─ Read ERROR_REFERENCE.md for specific errors
```

---

## Performance Metrics

```
GOOD Connection:
  • WebSocket transport used
  • Connection time: < 500ms
  • Message latency: < 100ms
  • No reconnection loops
  • Ping/Pong every 25s
  • Timeout: 60s

ACCEPTABLE Connection:
  • Polling transport used
  • Connection time: < 2s
  • Message latency: < 500ms
  • Occasional reconnects (network issue)
  • Data still syncs correctly
  • UI functional but slower

BAD Connection:
  • Continuous reconnect loops
  • Connection time: > 5s
  • Message latency: > 2s
  • Data not syncing
  • CORS errors in console
  • UI blank or stuck
  → Check ERROR_REFERENCE.md
```

---

**Architecture Version: 1.0**
**Status: Production-Ready**
**Last Updated: May 5, 2026**
