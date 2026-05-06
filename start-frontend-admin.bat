@echo off
REM Start HH DENTAL ADMIN frontend on port 5173

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║      Starting HH DENTAL Admin Panel                        ║
echo ║      URL: http://localhost:5173                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd /d "HH DENTAL ADMIN"

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install --legacy-peer-deps
)

echo Starting dev server on port 5173...
call npm run dev
