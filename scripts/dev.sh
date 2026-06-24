#!/bin/bash

# ==============================================================================
# Apex Capital - Local Development Launcher
# ==============================================================================

# This script concurrently starts both the FastAPI backend and Next.js frontend.
# Usage: ./scripts/dev.sh

echo "================================================="
echo "🚀 Starting Apex Capital Local Development"
echo "================================================="

# Start Backend
echo "Starting FastAPI Backend..."
cd backend || exit
source venv/bin/activate
# Run backend in the background
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "Starting Next.js Frontend..."
cd frontend || exit
# Run frontend in the background
npm run dev &
FRONTEND_PID=$!
cd ..

echo "================================================="
echo "✅ Both servers are starting up!"
echo "📡 Backend API: http://localhost:8000/docs"
echo "🌐 Frontend UI: http://localhost:3000"
echo "================================================="
echo "Press Ctrl+C to stop both servers."

# Trap SIGINT to cleanly kill both processes when the user exits
trap "echo 'Shutting down servers...'; kill $BACKEND_PID; kill $FRONTEND_PID; exit" SIGINT

# Wait for background processes
wait $BACKEND_PID
wait $FRONTEND_PID
