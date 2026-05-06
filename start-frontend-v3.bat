@echo off
REM Start hh-dental-v3-premium frontend on port 5174

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║      Starting HH DENTAL Frontend (v3-premium)             ║
echo ║      URL: http://localhost:5174                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd /d "hh-dental-v3-premium\hh-dental"

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo Starting dev server on port 5174...
call npm run dev
