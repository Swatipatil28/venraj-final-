# 🔧 Data Not Loading - Troubleshooting Guide

## ❌ ISSUE: Socket.IO Timeout

From your screenshots, you're seeing:
```
[Socket.IO] Connection Error: Error: timeout
```

This means the **backend server is not accessible** on port 5001.

---

## 🚨 STEP 1: START BACKEND SERVER

**The most likely issue: Backend is NOT running!**

### Windows (PowerShell):
```powershell
cd "C:\Users\swati\OneDrive\Apps\Desktop\HH CLINIC\hh-dental-backend\hh-backend"
npm run dev
```

**Expected output:**
```
H&H dental services Backend API
Server running on http://localhost:5001
Environment: development
Health: http://localhost:5001/health
```

If you see this → Backend is running ✅
If you get an error → See "Backend Won't Start" section below

---

## 📋 STEP 2: VERIFY ALL SERVICES

Open three separate terminals:

### Terminal 1: Backend
```bash
cd hh-dental-backend/hh-backend
npm run dev
# Should show: Server running on http://localhost:5001
```

### Terminal 2: Admin Frontend (5173)
```bash
cd "HH DENTAL ADMIN"
npm run dev
# Should show: ➜  Local: http://localhost:5173
```

### Terminal 3: V3-Premium Frontend (5174)
```bash
cd hh-dental-v3-premium/hh-dental
npm run dev
# Should show: ➜  Local: http://localhost:5174
```

**Check all three are running!** If any fails, proceed to troubleshooting below.

---

## ✅ STEP 3: TEST BACKEND IS RESPONDING

Once backend is running, test in PowerShell:

```powershell
# Test health endpoint
curl http://localhost:5001/health
# Should return: {"success": true, ...}

# Test services endpoint
curl http://localhost:5001/api/services
# Should return: [Array of services]

# Test doctors endpoint
curl http://localhost:5001/api/doctors
# Should return: [Array of doctors]
```

**All responding with data?** → Proceed to STEP 4

---

## 🔍 STEP 4: CHECK BROWSER CONSOLE

1. Open **http://localhost:5173** (Admin) or **http://localhost:5174** (V3)
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Look for messages about Socket.IO

### ✅ SUCCESS (You should see):
```
[Socket.IO] Connecting to: http://localhost:5001
✅ [Socket.IO] Connected! ID: <uuid> | Transport: websocket
API CALL: /services
API CALL: /doctors
...data appears on page...
```

### ❌ ERROR (You see):
```
❌ [Socket.IO] Connection Error: Error: timeout
```
→ Go to "BACKEND WON'T START" section

---

## 🆘 BACKEND WON'T START

### Error 1: EADDRINUSE (Port already in use)
```
Error: listen EADDRINUSE: address already in use :::5001
```

**Fix:**
```powershell
# Find process using port 5001
netstat -ano | findstr :5001
# Output: TCP    127.0.0.1:5001    LISTENING    12345

# Kill that process
taskkill /PID 12345 /F

# Now try npm run dev again
```

### Error 2: Cannot find module
```
Error: Cannot find module 'socket.io'
```

**Fix:**
```bash
cd hh-dental-backend/hh-backend
npm install
npm run dev
```

### Error 3: MongoDB connection error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Fix:**
```powershell
# Option 1: Install MongoDB locally
# Download from: https://www.mongodb.com/try/download/community

# Option 2: Use MongoDB Atlas (cloud)
# Update .env:
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# Option 3: Use Docker
# docker run -d -p 27017:27017 mongo
```

### Error 4: Nodemon not found
```
command not found: nodemon
```

**Fix:**
```bash
cd hh-dental-backend/hh-backend
npm install nodemon -g
npm run dev
```

### Error 5: NODE_ENV or other env variables
```
Cannot read property 'replace' of undefined
```

**Fix:** Create `.env` file in `hh-dental-backend/hh-backend/`:
```env
PORT=5001
HOST=0.0.0.0
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hh-dental
JWT_SECRET=your-secret-key-here
```

---

## 🧪 COMPLETE DIAGNOSTIC CHECK

Run this PowerShell script to test everything:

```powershell
# Test ports
echo "Checking ports..."
netstat -ano | findstr :5001
netstat -ano | findstr :5173
netstat -ano | findstr :5174

# Test endpoints
echo "Testing backend..."
curl http://localhost:5001/health
curl http://localhost:5001/api/services

# Check environment files
echo "Checking .env files..."
Get-Content "HH DENTAL ADMIN\.env.local"
Get-Content "hh-dental-v3-premium\hh-dental\.env.local"
```

---

## 📊 IF DATA STILL NOT SHOWING

Follow this checklist:

- [ ] Backend running? (Port 5001)
  - [ ] `curl http://localhost:5001/health` returns 200
  
- [ ] Admin frontend running? (Port 5173)
  - [ ] Can access `http://localhost:5173`
  
- [ ] V3-premium running? (Port 5174)
  - [ ] Can access `http://localhost:5174`
  
- [ ] Socket.IO connected?
  - [ ] Browser console shows: `✅ [Socket.IO] Connected!`
  
- [ ] No CORS errors?
  - [ ] Press F12 → Console tab is clean (no red errors)
  
- [ ] API endpoints working?
  - [ ] `curl http://localhost:5001/api/services` returns data
  - [ ] `curl http://localhost:5001/api/doctors` returns data
  
- [ ] .env files exist?
  - [ ] `HH DENTAL ADMIN/.env.local` exists
  - [ ] `hh-dental-v3-premium/hh-dental/.env.local` exists
  
- [ ] Environment variables correct?
  - [ ] Both .env files have: `VITE_API_URL=http://localhost:5001`

---

## 🔄 COMPLETE RESET (If nothing works)

```powershell
# 1. Kill all Node processes
taskkill /F /IM node.exe

# 2. Clear caches
rm -r hh-dental-backend/hh-backend/node_modules
rm -r "HH DENTAL ADMIN/node_modules"
rm -r hh-dental-v3-premium/hh-dental/node_modules

# 3. Reinstall
cd hh-dental-backend/hh-backend
npm install
npm run dev

# (In new terminal)
cd "HH DENTAL ADMIN"
npm install
npm run dev

# (In another new terminal)
cd hh-dental-v3-premium/hh-dental
npm install
npm run dev

# 4. Clear browser cache
# Ctrl+Shift+R in each browser tab

# 5. Test again
```

---

## 📞 EXPECTED CONSOLE OUTPUT

### ✅ When Everything Works:

**Backend Terminal:**
```
H&H dental services Backend API
Server running on http://localhost:5001
Environment: development

[Socket.IO]✓ User connected: abc123... | Transport: websocket
```

**Browser Console (Admin - 5173):**
```
[Socket.IO] Connecting to: http://localhost:5001
✅ [Socket.IO] Connected! ID: xyz789... | Transport: websocket
API CALL: /services
API CALL: /testimonials
API CALL: /doctors
API CALL: /clinics
```

**Page Display:**
- Header loads
- Navigation menu visible
- Cards/data appears (not blank skeletons)
- Real-time updates work

---

## 🎯 NEXT STEPS AFTER FIXING

Once everything is running and data appears:

1. **Test Real-Time Updates**
   - Create appointment in admin
   - Should appear instantly in other browsers
   - No manual refresh needed

2. **Test APIs Individually**
   - `/api/services` → Services list
   - `/api/doctors` → Doctors list
   - `/api/clinics` → Clinics list
   - `/api/appointments` → Appointments list

3. **Test Socket.IO Events**
   - Create data in one browser
   - Watch other browsers update automatically
   - No reconnection loops

4. **Verify Logging**
   - Backend logs show connection events
   - Console shows no CORS errors
   - No red errors in any terminal

---

## 🎓 QUICK COMMAND REFERENCE

| Task | Command |
|------|---------|
| Start Backend | `cd hh-dental-backend/hh-backend && npm run dev` |
| Start Admin | `cd "HH DENTAL ADMIN" && npm run dev` |
| Start V3 | `cd hh-dental-v3-premium/hh-dental && npm run dev` |
| Test Health | `curl http://localhost:5001/health` |
| Test Services | `curl http://localhost:5001/api/services` |
| Kill Port 5001 | `netstat -ano \| findstr :5001` then `taskkill /PID <PID> /F` |
| Clear NodeModules | `rm -r node_modules && npm install` |
| Hard Refresh | `Ctrl+Shift+R` |

---

**Status: Ready to Troubleshoot**

Follow these steps systematically and data should load! 🚀
