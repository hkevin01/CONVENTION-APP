#!/bin/bash

# Convention App - Full Stack Development Server
# This script starts both the backend and frontend development servers

echo "🚀 Starting Convention App Full Stack Development Environment"
echo "============================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $port is already in use"
        return 0
    else
        return 1
    fi
}

# Function to kill processes on specific ports
cleanup_ports() {
    echo "🧹 Cleaning up existing processes..."
    
    # Kill processes on common ports
    for port in 3000 5000 8081 19000 19001 19002; do
        if check_port $port; then
            echo "🔪 Killing process on port $port"
            lsof -ti:$port | xargs kill -9 2>/dev/null || true
        fi
    done
    
    sleep 2
}

# Function to start backend server
start_backend() {
    echo "🖥️  Starting Backend Server..."
    
    # Check if backend directory exists
    if [ ! -d "backend" ]; then
        echo "❌ Backend directory not found"
        return 1
    fi
    
    # Start backend in background
    cd backend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing backend dependencies..."
        npm install
    fi
    
    # Start the backend server
    echo "🔥 Backend starting on http://localhost:5000"
    npm start &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    return 0
}

# Function to start frontend server
start_frontend() {
    echo "📱 Starting Frontend Server..."
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        npm install
    fi
    
    # Start Expo development server
    echo "🔥 Frontend starting with Expo..."
    echo "📱 Scan QR code with Expo Go app to test on your device"
    echo "🌐 Or press 'w' to open in web browser"
    
    # Start Expo in tunnel mode for device testing
    npx expo start --tunnel &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
    
    return 0
}

# Function to display running services
show_services() {
    echo ""
    echo "🎉 Convention App Development Environment Started!"
    echo "=================================================="
    echo ""
    echo "📱 Frontend (Expo): http://localhost:19000"
    echo "🖥️  Backend API: http://localhost:5000"
    echo "📊 Backend Status: http://localhost:5000/api"
    echo ""
    echo "🔧 Available Endpoints:"
    echo "   • Authentication: http://localhost:5000/api/auth"
    echo "   • Events: http://localhost:5000/api/events"
    echo "   • Favorites: http://localhost:5000/api/favorites"
    echo "   • Notifications: http://localhost:5000/api/notifications"
    echo "   • Announcements: http://localhost:5000/api/announcements"
    echo ""
    echo "📱 Test the new Phase 2 features:"
    echo "   ✅ Advanced Event Search & Filtering"
    echo "   ✅ Offline Data Caching"
    echo "   ✅ QR Code Scanner (Ticket Check-ins)"
    echo "   ✅ Push Notifications"
    echo "   ✅ Event Favorites"
    echo "   ✅ Advanced Settings"
    echo ""
    echo "🛑 To stop both servers, press Ctrl+C or run: ./scripts/stop-fullstack.sh"
    echo ""
}

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping Convention App Development Environment..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        echo "🔪 Stopping backend server (PID: $BACKEND_PID)"
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        echo "🔪 Stopping frontend server (PID: $FRONTEND_PID)"
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    # Kill any remaining processes on our ports
    cleanup_ports
    
    echo "✅ All servers stopped successfully"
    exit 0
}

# Set trap to handle Ctrl+C
trap cleanup INT TERM

# Main execution
echo "🔍 Checking environment..."

# Check for required tools
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Please install Node.js"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Please install npm"; exit 1; }

# Clean up any existing processes
cleanup_ports

# Start backend server
if ! start_backend; then
    echo "❌ Failed to start backend server"
    exit 1
fi

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
for i in {1..10}; do
    if curl -s http://localhost:5000 >/dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "⚠️  Backend may not be responding, but continuing..."
    fi
    sleep 1
done

# Start frontend server
if ! start_frontend; then
    echo "❌ Failed to start frontend server"
    cleanup
    exit 1
fi

# Show service information
show_services

# Keep the script running and wait for user to stop
echo "⏳ Development servers are running. Press Ctrl+C to stop..."
wait
