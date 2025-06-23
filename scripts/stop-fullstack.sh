#!/bin/bash
# Convention App - Stop Full Stack Development Servers

echo "🛑 Stopping Convention App Development Environment..."

# Function to kill processes on specific ports
cleanup_ports() {
    echo "🧹 Cleaning up development server processes..."
    
    # Kill processes on common development ports
    for port in 3000 5000 8081 19000 19001 19002; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo "🔪 Killing process on port $port"
            lsof -ti:$port | xargs kill -9 2>/dev/null || true
        fi
    done
}

# Kill any running run-fullstack.sh scripts or related processes
PIDS=$(pgrep -f run-fullstack.sh 2>/dev/null || true)
if [ -n "$PIDS" ]; then
  echo "🔪 Killing running run-fullstack.sh processes: $PIDS"
  kill -9 $PIDS || true
  sleep 1
fi

# Kill any Node.js processes that might be our servers
echo "🔪 Stopping Node.js development servers..."
pkill -f "expo start" 2>/dev/null || true
pkill -f "npm start" 2>/dev/null || true
pkill -f "node.*server" 2>/dev/null || true

# Clean up ports
cleanup_ports

# Also try Docker cleanup if containers are running
if command -v docker-compose &> /dev/null; then
  docker-compose -f ./docker/docker-compose.yml down 2>/dev/null || true
else
  docker compose -f ./docker/docker-compose.yml down 2>/dev/null || true
fi

# Wait a moment for processes to terminate
sleep 2

echo "✅ All development servers stopped successfully"
echo "🚀 Run ./run-fullstack.sh to start again"