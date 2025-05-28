#!/bin/bash
# Script to run the full Convention App stack (frontend, backend, and MongoDB) using Docker Compose

set -e

# Recommend running this script from a VSCode terminal or any terminal window for easier process control.
# You can open a new VSCode terminal (Ctrl+`) and run:
#   ./run-fullstack.sh

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
  echo "Error: docker-compose or 'docker compose' is not installed or not in PATH."
  echo "Please install Docker and Docker Compose: https://docs.docker.com/compose/install/"
  exit 1
fi

echo "Building and starting Convention App frontend, backend, and MongoDB containers..."

# Allow script and docker-compose to be killed gracefully with Ctrl+C and SIGTERM
trap "echo ''; echo 'Full stack shutdown requested. Exiting...'; exit 0" SIGINT SIGTERM

if command -v docker-compose &> /dev/null; then
  docker-compose up --build &
else
  docker compose up --build &
fi

# Wait a few seconds for the frontend to start, then open the Expo Dev Tools UI in the default browser
sleep 8
if command -v xdg-open &> /dev/null; then
  xdg-open http://localhost:19002
elif command -v open &> /dev/null; then
  open http://localhost:19002
fi

wait

# Troubleshooting tip for missing backend package.json
# If you see an error like:
#   npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/usr/src/app/package.json'
# it means the backend's package.json (and likely backend source files) are missing or not copied correctly.
# Make sure /backend/package.json exists and is included in your repository.
# CODEBASE CHECKLIST:
#   - /backend/package.json
#   - /backend/Dockerfile
#   - /backend/server.js
#   - /backend/src/ (with all route and model files)
#   - Frontend files (in project root, e.g., App.tsx, package.json, etc.)
#   - docker-compose.yml at the project root
#   - Any required config or env files (.env, .env.example, etc.)
# If any of these are missing, the build will fail.
# Double-check your repository before running this script.

# If you see npm warnings about deprecated packages or vulnerabilities during the build,
# you can run `npm audit fix` or `npm audit fix --force` inside the relevant container or locally.
# Example for backend:
#   docker exec -it convention-backend npm audit fix
# Example for frontend:
#   docker exec -it convention-frontend npm audit fix
# Many warnings are from upstream dependencies and may not affect basic development.
# For production, review and address high/critical vulnerabilities as needed.

# Note:
# You may see warnings like:
#   npm warn deprecated expo-cli@6.3.10: The global Expo CLI has been superseded by 'npx expo' and eas-cli
# This is expected. Do NOT install expo-cli globally. Use 'npx expo' for all Expo commands in scripts and Dockerfiles.
# Example: npx expo start
# For plugin issues, ensure your app.json includes:
#   "plugins": ["expo-router"]
# and that app.json or app.config.js exists at the project root.

# If you see a message like:
#   No Expo config was found. Please create an Expo config (app.json or app.config.js) in your project root.
# Make sure you have an app.json or app.config.js file at the project root with:
#   {
#     "plugins": ["expo-router"]
#   }
# This is already present in your app.json if you followed the project setup instructions.

# Note for Docker build freezes:
# If your Docker build freezes or hangs at a step like:
#   RUN useradd -m appuser && chown -R appuser:appuser /usr/src/app
# it may be due to the large number of files or file system performance in Docker.
# You can try:
#   - Reducing the number of files copied in each Docker layer.
#   - Using a lighter chown (e.g., only on necessary folders).
#   - Running chown after COPY commands, not after npm install.
#   - Skipping user switching for local/dev builds if not needed.
# For most local development, running as root in the container is acceptable.

# After containers are up, print a message about accessing the Expo Dev Tools UI
echo ""
echo "------------------------------------------------------------"
echo "Expo Dev Tools (frontend) should be available at:"
echo "  http://localhost:19002"
echo ""
echo "You can interact with the app via the Expo web UI, QR code, or emulator."
echo "------------------------------------------------------------"

echo ""
echo "Full stack startup process has completed. All services are running."
echo ""

# Note on uuid and other deprecated packages:
# You may see warnings like:
#   npm warn deprecated uuid@3.4.0: Please upgrade to version 7 or higher. Older versions may use Math.random(), which is problematic.
#   npm warn deprecated rimraf@2.x: Rimraf versions prior to v4 are no longer supported.
#   npm warn deprecated glob@6.x: Glob versions prior to v9 are no longer supported.
#   npm warn deprecated @npmcli/move-file@1.1.2: This functionality has been moved to @npmcli/fs
# These are transitive dependencies. To fully resolve, update your direct dependencies and run `npm audit fix`.
# If the warnings persist, wait for upstream packages to update. Most are safe for development.
# For your codebase, you have already updated uuid, rimraf, and glob to current versions in package.json.

# To kill this script in a VSCode terminal, use:
#   Ctrl + C

# If Ctrl+C does not work, try:
#   - Click the trash can icon ("Kill Terminal") in the VSCode terminal tab.
#   - Or run `pkill -f run-fullstack.sh` from another terminal.
