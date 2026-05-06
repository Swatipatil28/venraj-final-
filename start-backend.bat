@echo off
REM Quick Start Script for HH DENTAL Stack
REM This script starts backend and frontend services in sequence

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║      HH DENTAL - Socket.IO Stack Quick Start              ║
echo ║      Backend: http://localhost:5001                        ║
echo ║      Frontend: http://localhost:5173 & http://localhost:5174 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

setlocal enabledelayedexpansion

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo   Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js found: 
node --version
echo.

REM Backend startup
echo [1/3] Starting Backend Server...
echo   Path: hh-dental-backend\hh-backend
echo   Port: 5001
cd /d "hh-dental-backend\hh-backend"
if not exist "node_modules" (
    echo   Installing dependencies...
    call npm install --legacy-peer-deps
)
call npm run dev
