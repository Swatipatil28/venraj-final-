@echo off
REM Socket.IO & API Diagnostic Script for Windows
REM Tests all connections and configurations

cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         H&H DENTAL - Complete Diagnostic Report           ║
echo ║                 May 5, 2026 - Windows                     ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if ports are in use
echo [1/5] CHECKING BACKEND SERVER
echo ─────────────────────────────────────────────────────────────

netstat -ano | findstr :5001 > nul
if errorlevel 1 (
    echo ✗ Backend server is NOT running on port 5001
    echo   Start with: cd hh-dental-backend\hh-backend ^&^& npm run dev
) else (
    echo ✓ Backend server is RUNNING on port 5001
)

echo.
echo [2/5] TESTING BACKEND ENDPOINTS
echo ─────────────────────────────────────────────────────────────

echo Testing /health...
curl -s http://localhost:5001/health > nul 2>&1
if errorlevel 1 (
    echo ✗ Health check FAILED
) else (
    echo ✓ /health responding
)

echo Testing /api/services...
curl -s http://localhost:5001/api/services > nul 2>&1
if errorlevel 1 (
    echo ✗ /api/services FAILED
) else (
    echo ✓ /api/services responding
)

echo Testing /api/doctors...
curl -s http://localhost:5001/api/doctors > nul 2>&1
if errorlevel 1 (
    echo ✗ /api/doctors FAILED
) else (
    echo ✓ /api/doctors responding
)

echo.
echo [3/5] CHECKING FRONTEND PORTS
echo ─────────────────────────────────────────────────────────────

netstat -ano | findstr :5173 > nul
if errorlevel 1 (
    echo ✗ Admin frontend NOT running on port 5173
) else (
    echo ✓ Admin frontend running on port 5173
)

netstat -ano | findstr :5174 > nul
if errorlevel 1 (
    echo ✗ V3-premium frontend NOT running on port 5174
) else (
    echo ✓ V3-premium frontend running on port 5174
)

echo.
echo [4/5] ENVIRONMENT CONFIGURATION
echo ─────────────────────────────────────────────────────────────

if exist "HH DENTAL ADMIN\.env.local" (
    echo ✓ Admin .env.local exists
    type "HH DENTAL ADMIN\.env.local"
) else (
    echo ✗ Admin .env.local NOT found
)

if exist "hh-dental-v3-premium\hh-dental\.env.local" (
    echo ✓ V3-premium .env.local exists
    type "hh-dental-v3-premium\hh-dental\.env.local"
) else (
    echo ✗ V3-premium .env.local NOT found
)

echo.
echo [5/5] SUMMARY
echo ─────────────────────────────────────────────────────────────

echo.
echo INSTRUCTIONS:
echo.
echo 1. Start Backend (in Terminal 1):
echo    cd "C:\Users\swati\OneDrive\Apps\Desktop\HH CLINIC\hh-dental-backend\hh-backend"
echo    npm run dev
echo.
echo 2. Start Admin (in Terminal 2):
echo    cd "C:\Users\swati\OneDrive\Apps\Desktop\HH CLINIC\HH DENTAL ADMIN"
echo    npm run dev
echo.
echo 3. Start V3-Premium (in Terminal 3):
echo    cd "C:\Users\swati\OneDrive\Apps\Desktop\HH CLINIC\hh-dental-v3-premium\hh-dental"
echo    npm run dev
echo.
echo 4. Once all are running:
echo    - Open http://localhost:5173 (Admin)
echo    - Open http://localhost:5174 (V3)
echo    - Check browser console for Socket.IO connection
echo.

echo ╚════════════════════════════════════════════════════════════╝
pause
