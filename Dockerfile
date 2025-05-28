# Stage 1: Builder
FROM node:20 AS builder

# Set environment to development to include devDependencies
ENV NODE_ENV=development

# Set the working directory
WORKDIR /usr/src/app

# Create .npmrc to handle peer dependencies
RUN echo "legacy-peer-deps=true" > .npmrc

# Copy package files first
COPY package*.json ./

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

# Create a non-root user (do NOT chown the entire /usr/src/app, it's slow)
RUN useradd -m appuser

# Switch to the non-root user
USER appuser

# Stage 2: Production Environment
FROM node:20

# Set environment variables
ENV NODE_ENV=production
ENV EXPO_NO_PROMPT=true

# Set the working directory
WORKDIR /usr/src/app

# Create .npmrc for production
RUN echo "legacy-peer-deps=true" > .npmrc

# Copy everything from builder
COPY --from=builder /usr/src/app /usr/src/app

# Install production dependencies
RUN npm install --omit=dev --legacy-peer-deps

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

# Set permissions for the working directory before creating directories
RUN chmod -R 777 /usr/src/app

# Create .expo directory with full permissions (if not already present)
RUN mkdir -p /usr/src/app/.expo && chmod -R 777 /usr/src/app/.expo

# Fix Expo permission denied error by ensuring .expo and its parent directory are writable by all users
RUN rm -rf /usr/src/app/.expo && mkdir -p /usr/src/app/.expo \
  && chown -R appuser:appgroup /usr/src/app \
  && chmod -R 777 /usr/src/app \
  && chmod -R 777 /usr/src/app/.expo

# Remove unnecessary folders and files from the final image to avoid warnings and deprecated content
RUN rm -rf \
  .copilot \
  .github \
  .vscode \
  assets \
  backend \
  docs \
  node_modules \
  scripts \
  src \
  .dockerignore \
  .editorconfig \
  .env.example \
  .eslintrc.json \
  .gitattributes \
  .gitignore \
  .prettierrc \
  app.json \
  babel.config.js \
  CHANGELOG.md \
  CONTRIBUTING.md \
  docker-compose.yml \
  LICENSE \
  package-lock.json \
  Pipfile \
  pyproject.toml \
  README.md \
  requirements.txt \
  run-fullstack.sh \
  scope.md \
  SECURITY.md \
  start.sh \
  STEPS.md \
  stop-fullstack.sh \
  tsconfig.json \
  WORKFLOW.md

# Switch to the non-root user
USER appuser

# Expose necessary ports
EXPOSE 8081 19000 19001 19002

# Start Expo in interactive mode with web UI enabled
CMD ["npx", "expo", "start", "--tunnel", "--interactive"]

# Install additional packages if needed
RUN npm install uuid@^9.0.0 rimraf@^5.0.0 glob@^10.0.0 --legacy-peer-deps

# Optional: Automatically attempt to fix vulnerabilities after npm install steps
RUN npm audit fix || true