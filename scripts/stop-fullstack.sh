#!/bin/bash
# Script to stop the full Convention App stack (frontend, backend, and MongoDB) using Docker Compose

set -e

# Kill any running run-fullstack.sh scripts or related processes
PIDS=$(pgrep -f run-fullstack.sh)
if [ -n "$PIDS" ]; then
  echo "Killing running run-fullstack.sh processes: $PIDS"
  kill -9 $PIDS || true
  # Give VSCode a hint to clear its "already running" warning
  sleep 1
else
  echo "No run-fullstack.sh process found."
fi

# Update Docker Compose path
if command -v docker-compose &> /dev/null; then
  docker-compose -f ./docker/docker-compose.yml down || true
else
  docker compose -f ./docker/docker-compose.yml down || true
fi

echo "Convention App stack stopped."