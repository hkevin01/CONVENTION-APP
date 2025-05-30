#!/bin/bash

# Convention App Fullstack Runner
# This script runs both the frontend and backend services concurrently

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print banner
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}    CONVENTION APP STARTER    ${NC}"
echo -e "${GREEN}================================${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed. Please install Node.js and npm.${NC}"
    exit 1
fi

# Check if concurrently is installed
if ! npm list -g concurrently &> /dev/null; then
    echo -e "${YELLOW}Installing concurrently package...${NC}"
    npm install -g concurrently
fi

# Define the commands to run
BACKEND_CMD="cd backend && npm start"
FRONTEND_CMD="npm start"

echo -e "${GREEN}Starting the Convention App (frontend + backend)...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Run both commands concurrently
concurrently \
    --names "BACKEND,FRONTEND" \
    --prefix-colors "cyan,magenta" \
    --kill-others \
    --kill-others-on-fail \
    "$BACKEND_CMD" \
    "$FRONTEND_CMD"

# Handle script termination
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    exit 0
}

# Register the cleanup function for these signals
trap cleanup SIGINT SIGTERM

# Wait for the script to be interrupted
wait
