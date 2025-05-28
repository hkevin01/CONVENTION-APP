#!/bin/bash
# Script to stop the full Convention App stack (frontend, backend, and MongoDB) using Docker Compose

set -e

# If this script is run from a VSCode terminal that is busy, try to run itself in a new terminal window.
if [ -n "$VSCODE_GIT_IPC_HANDLE" ] && [ -n "$PS1" ]; then
  # Try to launch in a new terminal using x-terminal-emulator, gnome-terminal, or xterm
  if command -v x-terminal-emulator &> /dev/null; then
    x-terminal-emulator -e bash "$0" &
    exit 0
  elif command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "$0"
    exit 0
  elif command -v xterm &> /dev/null; then
    xterm -e bash "$0" &
    exit 0
  fi
fi

# Try to stop docker compose services
if command -v docker-compose &> /dev/null; then
  docker-compose down || true
else
  docker compose down || true
fi

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

# If VSCode says "code is already running" and won't let you run this script,
# open a new terminal window or tab (outside the busy VSCode terminal) and run:
#   ./stop-fullstack.sh
# Or, from any terminal, you can force kill all related processes:
pkill -f run-fullstack.sh || true
pkill -f "docker-compose up" || true
pkill -f "docker compose up" || true

echo "Convention App stack stopped."
exit 0

# To fix "Permission denied", make the script executable:
# Run this command in your terminal:
#   chmod +x /home/kevin/Projects/Development/CON/convention-app-client/stop-fullstack.sh

# Then run the script with:
#   ./stop-fullstack.sh

# If you still get "command not found", check for typos in the path and ensure the file exists.
