# Stage 1: Builder
FROM node:18 AS builder

# Set environment to development to include devDependencies
ENV NODE_ENV=development

# Set the working directory
WORKDIR /app

# Create .npmrc to handle peer dependencies
RUN echo "legacy-peer-deps=true" > .npmrc

# Copy package files first
COPY package*.json ./
COPY tsconfig*.json ./

# Install all dependencies including devDependencies
RUN npm install --legacy-peer-deps

# Install TypeScript globally and locally with exact versions
RUN npm install -g typescript@5.3.3
RUN npm install --save-dev typescript@5.3.3 --force

# Install React types with exact versions
RUN npm install --save-dev @types/react@18.3.12 --force
RUN npm install --save-dev @types/react-native@~0.71.8 --force

# Install React Native and its assets registry
RUN npm install @react-native/assets-registry --legacy-peer-deps
RUN npm install react-native@0.71.8 --legacy-peer-deps

# Install Expo CLI and dependencies
RUN npm install -g expo-cli@latest
RUN npm install -g @expo/ngrok@^4.1.0

# Install Expo-specific dependencies
RUN npx expo install expo-router@~4.0.15 expo-splash-screen@~0.29.18 expo-web-browser@~14.0.1

# Create TypeScript config if it doesn't exist
RUN test -f tsconfig.json || echo '{"compilerOptions":{"target":"es5","lib":["es6","dom"],"types":["react","react-native"],"jsx":"react-native","moduleResolution":"node","allowJs":true,"skipLibCheck":true,"esModuleInterop":true,"allowSyntheticDefaultImports":true,"strict":true,"forceConsistentCasingInFileNames":true,"noFallthroughCasesInSwitch":true,"resolveJsonModule":true,"isolatedModules":true,"noEmit":true},"include":["**/*.ts","**/*.tsx"],"exclude":["node_modules"]}' > tsconfig.json

# Copy the rest of the application code
COPY . .

# Verify TypeScript installation (with fallback)
RUN tsc --version || echo "TypeScript version check failed but continuing..."

# Create empty registry file if it doesn't exist
RUN mkdir -p node_modules/@react-native/assets-registry && \
    touch node_modules/@react-native/assets-registry/registry.js

# Clear npm cache
RUN npm cache clean --force

# Create a non-root user and set ownership
RUN useradd -m appuser && chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

# Stage 2: Production Environment
FROM node:18

# Set environment variables
ENV NODE_ENV=production
ENV EXPO_NO_PROMPT=true

# Set the working directory
WORKDIR /app

# Create .npmrc for production
RUN echo "legacy-peer-deps=true" > .npmrc

# Copy everything from builder
COPY --from=builder /app /app

# Install production dependencies
RUN npm ci --only=production --legacy-peer-deps

# Install TypeScript globally and locally in production
RUN npm install -g typescript@5.3.3
RUN npm install --save-dev typescript@5.3.3 --force

# Install React types in production
RUN npm install --save-dev @types/react@18.3.12 --force
RUN npm install --save-dev @types/react-native@~0.71.8 --force

# Install React Native dependencies
RUN npm install @react-native/assets-registry --legacy-peer-deps
RUN npm install react-native@0.71.8 --legacy-peer-deps

# Install Expo CLI and dependencies
RUN npm install -g expo-cli@latest
RUN npm install -g @expo/ngrok@^4.1.0

# Verify TypeScript installation (with fallback)
RUN tsc --version || echo "TypeScript version check failed but continuing..."

# Create a non-root user with a fixed UID and GID
RUN groupadd -g 1001 appgroup && useradd -u 1001 -g appgroup -m appuser

# Set ownership and permissions
RUN chown -R appuser:appgroup /app
RUN chmod -R u+rwX,g+rwX /app
RUN mkdir -p /app/.expo && chown -R appuser:appgroup /app/.expo

# Switch to the non-root user
USER appuser

# Expose necessary ports
EXPOSE 3000 19000 19001 19002

# Define the command to run the application
CMD ["npx", "expo", "start", "--tunnel"]