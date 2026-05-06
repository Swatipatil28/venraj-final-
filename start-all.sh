#!/bin/bash
# Quick start all services using tmux or bash
# For macOS/Linux users

echo "🚀 Starting HH DENTAL Stack..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found:${NC} $(node --version)"
echo ""

# Start backend
echo -e "${YELLOW}[1/3] Starting Backend (port 5001)...${NC}"
cd "hh-dental-backend/hh-backend"
npm run dev &
BACKEND_PID=$!
sleep 3

# Start frontend v3
echo -e "${YELLOW}[2/3] Starting Frontend v3-premium (port 5174)...${NC}"
cd "../../hh-dental-v3-premium/hh-dental"
npm run dev &
FRONTEND_V3_PID=$!
sleep 2

# Start admin
echo -e "${YELLOW}[3/3] Starting Admin Panel (port 5173)...${NC}"
cd "../../HH DENTAL ADMIN"
npm run dev &
ADMIN_PID=$!

echo ""
echo -e "${GREEN}✅ All services started!${NC}"
echo ""
echo "📱 Access points:"
echo "   Backend:        http://localhost:5001"
echo "   Frontend v3:    http://localhost:5174"
echo "   Admin Panel:    http://localhost:5173"
echo ""
echo "🛑 To stop all services, press Ctrl+C or run:"
echo "   kill $BACKEND_PID $FRONTEND_V3_PID $ADMIN_PID"
echo ""

# Wait for all processes
wait
