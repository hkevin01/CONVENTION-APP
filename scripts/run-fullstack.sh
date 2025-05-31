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

# Function to check for and stop running services
check_running_services() {
    echo -e "${YELLOW}Checking for running services that might conflict...${NC}"
    
    # Check for running Docker containers
    if command -v docker &> /dev/null; then
        RUNNING_CONTAINERS=$(docker ps --filter "name=convention-app" -q)
        if [ ! -z "$RUNNING_CONTAINERS" ]; then
            echo -e "${YELLOW}Found running Docker containers related to the app:${NC}"
            docker ps --filter "name=convention-app"
            read -p "Do you want to stop these containers? (y/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                echo -e "${YELLOW}Stopping Docker containers...${NC}"
                docker stop $RUNNING_CONTAINERS
                echo -e "${GREEN}Containers stopped.${NC}"
            fi
        fi
    fi
    
    # Check for processes using our ports
    BACKEND_PORT=5000
    FRONTEND_PORTS=(19006 8081 19000)
    
    PORTS_IN_USE=false
    
    # Check backend port
    if lsof -i:$BACKEND_PORT -t &> /dev/null; then
        echo -e "${YELLOW}Port $BACKEND_PORT (backend) is in use.${NC}"
        PORTS_IN_USE=true
    fi
    
    # Check frontend ports
    for PORT in "${FRONTEND_PORTS[@]}"; do
        if lsof -i:$PORT -t &> /dev/null; then
            echo -e "${YELLOW}Port $PORT (frontend) is in use.${NC}"
            PORTS_IN_USE=true
        fi
    done
    
    if [ "$PORTS_IN_USE" = true ]; then
        read -p "Do you want to kill processes using these ports? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Killing processes...${NC}"
            
            # Kill backend port process
            BACKEND_PID=$(lsof -i:$BACKEND_PORT -t)
            if [ ! -z "$BACKEND_PID" ]; then
                kill -9 $BACKEND_PID 2>/dev/null
            fi
            
            # Kill frontend port processes
            for PORT in "${FRONTEND_PORTS[@]}"; do
                FRONTEND_PID=$(lsof -i:$PORT -t)
                if [ ! -z "$FRONTEND_PID" ]; then
                    kill -9 $FRONTEND_PID 2>/dev/null
                fi
            done
            
            echo -e "${GREEN}Processes killed.${NC}"
            # Give system time to release ports
            sleep 2
        else
            echo -e "${YELLOW}Continuing with ports in use. This might cause conflicts.${NC}"
        fi
    else
        echo -e "${GREEN}No conflicting services found.${NC}"
    fi
}

# Check for running services before starting
check_running_services

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed. Please install Node.js and npm.${NC}"
    exit 1
fi

# Check if script is being recursively called
if [ "$INSIDE_RUNNER" = "1" ]; then
    echo -e "${RED}Error: Infinite loop detected. The 'npm start' command in package.json should not call this script.${NC}"
    echo -e "${YELLOW}Please update your package.json to use a direct command instead of this script.${NC}"
    exit 1
fi

export INSIDE_RUNNER=1

# Check for backend dependencies
echo -e "${YELLOW}Checking backend dependencies...${NC}"
if [ ! -d "backend/node_modules/express" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    (cd backend && npm install)
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install backend dependencies. Aborting.${NC}"
        exit 1
    fi
fi

# Check for MongoDB configuration
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Creating MongoDB configuration...${NC}"
    cat > backend/.env << EOL
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/convention-app
# If using MongoDB Atlas, uncomment and replace with your connection string:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/convention-app

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=5000
NODE_ENV=development
EOL
    echo -e "${GREEN}Created .env file in backend directory.${NC}"
    echo -e "${YELLOW}Note: You may need to edit backend/.env with your actual MongoDB connection string.${NC}"
fi

# Check and update Expo dependencies automatically
echo -e "${YELLOW}Checking Expo dependencies for compatibility...${NC}"
EXPO_OUTDATED=$(NPM_CONFIG_CACHE_MIN= npx expo-doctor || true)
if [[ $EXPO_OUTDATED == *"should be updated"* ]]; then
    echo -e "${YELLOW}Updating Expo dependencies to expected versions...${NC}"
    # Install all expected versions automatically with preferred options
    NPM_CONFIG_CACHE_MIN= npx expo install --fix --non-interactive --prefer-offline
    echo -e "${GREEN}Expo dependencies updated successfully.${NC}"
fi

# Check for missing route files referenced in server.js
echo -e "${YELLOW}Checking for required route files...${NC}"
mkdir -p backend/src/routes

ROUTE_FILES=("auth" "events" "announcements" "profile" "tickets")
for route in "${ROUTE_FILES[@]}"; do
    if [ ! -f "backend/src/routes/${route}.js" ]; then
        echo -e "${YELLOW}Creating placeholder ${route} route file...${NC}"
        mkdir -p backend/src/routes
        cat > "backend/src/routes/${route}.js" << EOL
const express = require('express');
const router = express.Router();

// Placeholder route for ${route}
router.get('/', (req, res) => {
  res.json({ message: '${route} endpoint is working' });
});

module.exports = router;
EOL
    fi
done

# Add option to update Expo dependencies
read -p "Would you like to check and update Expo dependencies for compatibility? (y/n) " -n 1 -r UPDATE_EXPO
echo
if [[ $UPDATE_EXPO =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Updating Expo dependencies...${NC}"
    npx expo install --fix
fi

# Check if concurrently is installed locally, if not install it as a dev dependency
if ! npm list concurrently &> /dev/null; then
    echo -e "${YELLOW}Installing concurrently as a local dependency...${NC}"
    npm install --save-dev concurrently --no-fund --prefer-offline
fi

# Check for Expo entry point issues in package.json
echo -e "${YELLOW}Checking Expo project configuration...${NC}"
if [ -f "package.json" ]; then
    # Ensure the main entry point is properly configured
    if ! grep -q '"main": "node_modules/expo/AppEntry.js"' package.json; then
        echo -e "${YELLOW}Fixing package.json main entry point...${NC}"
        # Use temporary file to avoid sed differences between GNU and BSD
        cat package.json | jq '.main = "node_modules/expo/AppEntry.js"' > package.json.tmp
        mv package.json.tmp package.json
        echo -e "${GREEN}Updated package.json with correct entry point.${NC}"
    fi
    
    # Create App.js file if it doesn't exist (required by AppEntry.js)
    if [ ! -f "App.js" ] && [ ! -f "App.tsx" ]; then
        echo -e "${YELLOW}Creating App.js file required by Expo...${NC}"
        cat > App.js << EOL
import React from 'react';
import { registerRootComponent } from 'expo';
import { View, Text, StyleSheet } from 'react-native';

function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Convention App</Text>
      <Text style={styles.subtitle}>Welcome to the Convention App!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
});

export default registerRootComponent(App);
EOL
        echo -e "${GREEN}Created App.js file.${NC}"
    fi
    
    # Check for expo/metro.config.js
    if [ ! -f "metro.config.js" ]; then
        echo -e "${YELLOW}Creating metro.config.js for Expo...${NC}"
        cat > metro.config.js << EOL
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;
EOL
        echo -e "${GREEN}Created metro.config.js file.${NC}"
    fi
    
    # Create or update babel.config.js for proper Expo configuration
    echo -e "${YELLOW}Creating/updating babel.config.js for Expo SDK compatibility...${NC}"
    cat > babel.config.js << EOL
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // NOTE: No plugins array needed for SDK 50+ as expo-router/babel is now deprecated
  };
};
EOL
    echo -e "${GREEN}Created/updated babel.config.js file.${NC}"
    
    # Create assets directory and default images if they don't exist
    if [ ! -d "assets" ]; then
        echo -e "${YELLOW}Creating assets directory with default images...${NC}"
        mkdir -p assets
        
        # Use a simpler approach to create placeholder PNG files
        echo -e "${YELLOW}Creating placeholder image assets...${NC}"
        
        # Create minimal PNG files using dd command
        # This creates a simple 1x1 pixel transparent PNG
        printf "\x89\x50\x4E\x47\x0D\x0A\x1A\x0A\x00\x00\x00\x0D\x49\x48\x44\x52\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1F\x15\xC4\x89\x00\x00\x00\x0A\x49\x44\x41\x54\x78\x9C\x63\x00\x01\x00\x00\x05\x00\x01\x0D\x0A\x2D\xB4\x00\x00\x00\x00\x49\x45\x4E\x44\xAE\x42\x60\x82" > assets/favicon.png
        
        # Copy to other required image files
        cp assets/favicon.png assets/icon.png
        cp assets/favicon.png assets/splash.png
        cp assets/favicon.png assets/adaptive-icon.png
        
        # Create a fallback.txt file as backup
        echo "Convention App" > assets/fallback.txt
        
        echo -e "${GREEN}Created placeholder images in assets directory.${NC}"
        
        # Add a default HTML fallback for web
        cat > assets/fallback.html << EOL
<!DOCTYPE html>
<html>
<head>
  <title>Convention App</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      height: 100vh; 
      margin: 0;
      background-color: #f5f5f5;
    }
    .container {
      text-align: center;
      padding: 20px;
    }
    h1 { color: #333; }
    p { color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Convention App</h1>
    <p>Welcome to the Convention App!</p>
  </div>
</body>
</html>
EOL
    fi
    
    # Create or update app.json for proper Expo configuration
    if [ ! -f "app.json" ]; then
        echo -e "${YELLOW}Creating app.json for Expo...${NC}"
        cat > app.json << EOL
{
  "expo": {
    "name": "Convention App",
    "slug": "convention-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
EOL
        echo -e "${GREEN}Created app.json file.${NC}"
    fi
fi

# Define the commands to run (updating to ensure a clean start)
BACKEND_CMD="cd backend && npm start"
# Use a more reliable approach for starting Expo with clear cache
FRONTEND_CMD="EXPO_NO_TYPESCRIPT_SETUP=1 EXPO_NO_ROUTER_SETUP=1 npx expo start --web --clear"

echo -e "${GREEN}Starting the Convention App (frontend + backend)...${NC}"
echo -e "${GREEN}The frontend will automatically open in your default browser.${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Run both commands using local concurrently
npx concurrently \
    --names "BACKEND,FRONTEND" \
    --prefix-colors "cyan,magenta" \
    --kill-others \
    --kill-others-on-fail \
    "$BACKEND_CMD" \
    "$FRONTEND_CMD" &

CONCURRENTLY_PID=$!

# Check for Expo entry point issues in package.json
echo -e "${YELLOW}Checking Expo project configuration...${NC}"
if [ -f "package.json" ]; then
    # Ensure the main entry point is properly configured
    if ! grep -q '"main": "node_modules/expo/AppEntry.js"' package.json; then
        echo -e "${YELLOW}Fixing package.json main entry point...${NC}"
        # Use temporary file to avoid sed differences between GNU and BSD
        cat package.json | jq '.main = "node_modules/expo/AppEntry.js"' > package.json.tmp
        mv package.json.tmp package.json
        echo -e "${GREEN}Updated package.json with correct entry point.${NC}"
    fi
    
    # Create App.js file if it doesn't exist (required by AppEntry.js)
    if [ ! -f "App.js" ] && [ ! -f "App.tsx" ]; then
        echo -e "${YELLOW}Creating App.js file required by Expo...${NC}"
        cat > App.js << EOL
import React from 'react';
import { registerRootComponent } from 'expo';
import { View, Text, StyleSheet } from 'react-native';

function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Convention App</Text>
      <Text style={styles.subtitle}>Welcome to the Convention App!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
});

export default registerRootComponent(App);
EOL
        echo -e "${GREEN}Created App.js file.${NC}"
    fi
    
    # Check for expo/metro.config.js
    if [ ! -f "metro.config.js" ]; then
        echo -e "${YELLOW}Creating metro.config.js for Expo...${NC}"
        cat > metro.config.js << EOL
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;
EOL
        echo -e "${GREEN}Created metro.config.js file.${NC}"
    fi
    
    # Create or update babel.config.js for proper Expo configuration
    echo -e "${YELLOW}Creating/updating babel.config.js for Expo SDK compatibility...${NC}"
    cat > babel.config.js << EOL
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // NOTE: No plugins array needed for SDK 50+ as expo-router/babel is now deprecated
  };
};
EOL
    echo -e "${GREEN}Created/updated babel.config.js file.${NC}"
    
    # Create assets directory and default images if they don't exist
    if [ ! -d "assets" ]; then
        echo -e "${YELLOW}Creating assets directory with default images...${NC}"
        mkdir -p assets
        
        # Use a simpler approach to create placeholder PNG files
        echo -e "${YELLOW}Creating placeholder image assets...${NC}"
        
        # Create minimal PNG files using dd command
        # This creates a simple 1x1 pixel transparent PNG
        printf "\x89\x50\x4E\x47\x0D\x0A\x1A\x0A\x00\x00\x00\x0D\x49\x48\x44\x52\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1F\x15\xC4\x89\x00\x00\x00\x0A\x49\x44\x41\x54\x78\x9C\x63\x00\x01\x00\x00\x05\x00\x01\x0D\x0A\x2D\xB4\x00\x00\x00\x00\x49\x45\x4E\x44\xAE\x42\x60\x82" > assets/favicon.png
        
        # Copy to other required image files
        cp assets/favicon.png assets/icon.png
        cp assets/favicon.png assets/splash.png
        cp assets/favicon.png assets/adaptive-icon.png
        
        # Create a fallback.txt file as backup
        echo "Convention App" > assets/fallback.txt
        
        echo -e "${GREEN}Created placeholder images in assets directory.${NC}"
        
        # Add a default HTML fallback for web
        cat > assets/fallback.html << EOL
<!DOCTYPE html>
<html>
<head>
  <title>Convention App</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      height: 100vh; 
      margin: 0;
      background-color: #f5f5f5;
    }
    .container {
      text-align: center;
      padding: 20px;
    }
    h1 { color: #333; }
    p { color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Convention App</h1>
    <p>Welcome to the Convention App!</p>
  </div>
</body>
</html>
EOL
    fi
    
    # Create or update app.json for proper Expo configuration
    if [ ! -f "app.json" ]; then
        echo -e "${YELLOW}Creating app.json for Expo...${NC}"
        cat > app.json << EOL
{
  "expo": {
    "name": "Convention App",
    "slug": "convention-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
EOL
        echo -e "${GREEN}Created app.json file.${NC}"
    fi
fi

# Function to check service status
check_service_status() {
    # Wait a bit for services to start
    sleep 5
    
    echo -e "\n${GREEN}====== CONVENTION APP STATUS ======${NC}"
    
    # Check backend
    if curl -s http://localhost:5000 > /dev/null; then
        echo -e "${GREEN}✓ Backend API:${NC} Running at http://localhost:5000"
    else
        echo -e "${RED}✗ Backend API:${NC} Not responding at http://localhost:5000"
    fi
    
    # Check frontend (with more options for different ports)
    for port in 19006 8081 19000; do
        if curl -s http://localhost:$port > /dev/null; then
            echo -e "${GREEN}✓ Frontend:${NC} Running at http://localhost:$port"
            FRONTEND_RUNNING=true
            break
        fi
    done
    
    if [ -z "$FRONTEND_RUNNING" ]; then
        echo -e "${RED}✗ Frontend:${NC} Not detected on expected ports"
        echo -e "   Try manually opening: http://localhost:19006 or http://localhost:8081"
    fi
    
    # Check MongoDB
    if grep -q "MongoDB connection established successfully" <(tail -n 10 /tmp/convention-app-backend.log 2>/dev/null); then
        echo -e "${GREEN}✓ Database:${NC} MongoDB connected"
    elif grep -q "MongoDB connection error" <(tail -n 10 /tmp/convention-app-backend.log 2>/dev/null); then
        echo -e "${RED}✗ Database:${NC} MongoDB connection failed"
    else
        echo -e "${YELLOW}? Database:${NC} Status unknown"
    fi
    
    echo -e "${GREEN}==================================${NC}"
    echo -e "\n${YELLOW}Services are running in the background. Press Ctrl+C to stop all services.${NC}"
}

# Run status check in the background after a delay
check_service_status &

# Handle script termination
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    kill $CONCURRENTLY_PID 2>/dev/null
    exit 0
}

# Register the cleanup function for these signals
trap cleanup SIGINT SIGTERM

# Wait for the script to be interrupted
wait
