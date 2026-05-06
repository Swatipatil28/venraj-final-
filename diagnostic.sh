#!/bin/bash
# Socket.IO & API Diagnostic Script
# Tests all connections and configurations

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         H&H DENTAL - Complete Diagnostic Report           ║"
echo "║                 May 5, 2026                               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ────────────────────────────────────────────────────────────────
echo -e "${BLUE}[1/6] CHECKING BACKEND SERVER${NC}"
echo "─────────────────────────────────────────────────────────────"

if nc -z localhost 5001 2>/dev/null; then
  echo -e "${GREEN}✓ Backend server is RUNNING on port 5001${NC}"
else
  echo -e "${RED}✗ Backend server is NOT running on port 5001${NC}"
  echo "   Start with: cd hh-dental-backend/hh-backend && npm run dev"
fi

# ────────────────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}[2/6] TESTING BACKEND ENDPOINTS${NC}"
echo "─────────────────────────────────────────────────────────────"

# Test health endpoint
echo -n "Testing /health... "
response=$(curl -s -w "%{http_code}" http://localhost:5001/health -o /tmp/health.json)
if [ "$response" = "200" ]; then
  echo -e "${GREEN}✓ 200 OK${NC}"
  echo "Response: $(cat /tmp/health.json)"
else
  echo -e "${RED}✗ HTTP $response${NC}"
fi

# Test services endpoint
echo -n "Testing /api/services... "
response=$(curl -s -w "%{http_code}" http://localhost:5001/api/services -o /tmp/services.json)
if [ "$response" = "200" ]; then
  echo -e "${GREEN}✓ 200 OK${NC}"
  count=$(cat /tmp/services.json | grep -o '"_id"' | wc -l)
  echo "   Found $count services"
else
  echo -e "${RED}✗ HTTP $response${NC}"
fi

# Test doctors endpoint
echo -n "Testing /api/doctors... "
response=$(curl -s -w "%{http_code}" http://localhost:5001/api/doctors -o /tmp/doctors.json)
if [ "$response" = "200" ]; then
  echo -e "${GREEN}✓ 200 OK${NC}"
  count=$(cat /tmp/doctors.json | grep -o '"_id"' | wc -l)
  echo "   Found $count doctors"
else
  echo -e "${RED}✗ HTTP $response${NC}"
fi

# Test clinics endpoint
echo -n "Testing /api/clinics... "
response=$(curl -s -w "%{http_code}" http://localhost:5001/api/clinics -o /tmp/clinics.json)
if [ "$response" = "200" ]; then
  echo -e "${GREEN}✓ 200 OK${NC}"
  count=$(cat /tmp/clinics.json | grep -o '"_id"' | wc -l)
  echo "   Found $count clinics"
else
  echo -e "${RED}✗ HTTP $response${NC}"
fi

# ────────────────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}[3/6] TESTING SOCKET.IO SERVER${NC}"
echo "─────────────────────────────────────────────────────────────"

echo -n "Testing Socket.IO endpoint... "
response=$(curl -s -w "%{http_code}" http://localhost:5001/socket.io/ -o /tmp/socket.json)
if [ "$response" = "200" ]; then
  echo -e "${GREEN}✓ 200 OK (Socket.IO server responding)${NC}"
else
  echo -e "${RED}✗ HTTP $response${NC}"
fi

# ────────────────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}[4/6] CHECKING FRONTEND PORTS${NC}"
echo "─────────────────────────────────────────────────────────────"

if nc -z localhost 5173 2>/dev/null; then
  echo -e "${GREEN}✓ Admin frontend running on port 5173${NC}"
else
  echo -e "${RED}✗ Admin frontend NOT running on port 5173${NC}"
  echo "   Start with: cd 'HH DENTAL ADMIN' && npm run dev"
fi

if nc -z localhost 5174 2>/dev/null; then
  echo -e "${GREEN}✓ V3-premium frontend running on port 5174${NC}"
else
  echo -e "${RED}✗ V3-premium frontend NOT running on port 5174${NC}"
  echo "   Start with: cd hh-dental-v3-premium/hh-dental && npm run dev"
fi

# ────────────────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}[5/6] ENVIRONMENT CONFIGURATION${NC}"
echo "─────────────────────────────────────────────────────────────"

if [ -f "HH DENTAL ADMIN/.env.local" ]; then
  echo -e "${GREEN}✓ Admin .env.local exists${NC}"
  grep "VITE_API" "HH DENTAL ADMIN/.env.local"
else
  echo -e "${RED}✗ Admin .env.local NOT found${NC}"
fi

if [ -f "hh-dental-v3-premium/hh-dental/.env.local" ]; then
  echo -e "${GREEN}✓ V3-premium .env.local exists${NC}"
  grep "VITE_API" "hh-dental-v3-premium/hh-dental/.env.local"
else
  echo -e "${RED}✗ V3-premium .env.local NOT found${NC}"
fi

# ────────────────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}[6/6] SUMMARY${NC}"
echo "─────────────────────────────────────────────────────────────"

all_ok=true

if ! nc -z localhost 5001 2>/dev/null; then
  echo -e "${RED}❌ CRITICAL: Backend not running on port 5001${NC}"
  all_ok=false
fi

if ! nc -z localhost 5173 2>/dev/null; then
  echo -e "${RED}❌ Admin frontend not running${NC}"
  all_ok=false
fi

if ! nc -z localhost 5174 2>/dev/null; then
  echo -e "${RED}❌ V3-premium frontend not running${NC}"
  all_ok=false
fi

if [ "$all_ok" = true ]; then
  echo -e "${GREEN}✓ All services running!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Open http://localhost:5173 (Admin)"
  echo "2. Open http://localhost:5174 (V3-premium)"
  echo "3. Check browser console for Socket.IO connection"
  echo "4. Verify data is loading"
else
  echo -e "${RED}Some services are not running. Please start them first.${NC}"
fi

echo ""
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
