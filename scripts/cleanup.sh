#!/bin/bash
# Script to remove unwanted files and directories from the project
# Use with caution - this will permanently delete files

set -e

echo "======================================================"
echo "  CONVENTION APP CLEANUP SCRIPT"
echo "======================================================"
echo "This script will remove unwanted files and directories."
echo "WARNING: This is a destructive operation and cannot be undone."
echo

# Define arrays of patterns to remove
DIRS_TO_REMOVE=(
  "node_modules"
  "build"
  "dist"
  "coverage"
  ".expo"
  ".expo-shared"
  "web-build"
  "expo-build"
)

FILES_TO_REMOVE=(
  "npm-debug.log*"
  "yarn-debug.log*"
  "yarn-error.log*"
  "pnpm-debug.log*"
  "*.log"
  ".DS_Store"
  "Thumbs.db"
  "*.tmp"
  "*.swp"
  "*.bak"
  "output.log"
)

# Add additional files that have been moved to subdirectories
ROOT_FILES_MOVED=(
  "Dockerfile"         # Moved to docker/frontend/Dockerfile
  "docker-compose.yml" # Moved to docker/docker-compose.yml
  "run-fullstack.sh"   # Moved to scripts/run-fullstack.sh
  "stop-fullstack.sh"  # Moved to scripts/stop-fullstack.sh
  "WORKFLOW.md"        # Moved to docs/WORKFLOW.md
  "CONTRIBUTING.md"    # Moved to docs/CONTRIBUTING.md
  "CHANGELOG.md"       # Moved to docs/CHANGELOG.md
  "SECURITY.md"        # Moved to docs/SECURITY.md
  "scope.md"           # Moved to docs/scope.md
  "code_map.json"      # Moved to json/code_map.json
  "git-info-and-set-remote.sh" # Moved to scripts/git-info-and-set-remote.sh
)

# Function to confirm before proceeding
confirm() {
  read -p "Are you sure you want to continue? (y/n) " answer
  case ${answer:0:1} in
    y|Y )
      echo "Proceeding with cleanup..."
      ;;
    * )
      echo "Operation cancelled."
      exit 0
      ;;
  esac
}

# Function to find and print matching files/dirs without removing
dry_run() {
  echo "=== DRY RUN - Files/directories that would be removed: ==="
  
  echo "Directories:"
  for dir in "${DIRS_TO_REMOVE[@]}"; do
    find . -type d -name "$dir" -not -path "*/node_modules/*" -not -path "*/\.*/*" | sort
  done
  
  echo "Files:"
  for file in "${FILES_TO_REMOVE[@]}"; do
    find . -type f -name "$file" -not -path "*/node_modules/*" -not -path "*/\.*/*" | sort
  done
  
  echo "=================================================="
}

# Function to actually remove files
remove_files() {
  # Remove directories
  for dir in "${DIRS_TO_REMOVE[@]}"; do
    echo "Removing directories matching: $dir"
    find . -type d -name "$dir" -not -path "*/\.*/*" -exec rm -rf {} \; 2>/dev/null || true
  done
  
  # Remove files
  for file in "${FILES_TO_REMOVE[@]}"; do
    echo "Removing files matching: $file"
    find . -type f -name "$file" -not -path "*/\.*/*" -exec rm -f {} \; 2>/dev/null || true
  done
}

# Function to check and remove root files that have been moved
remove_moved_root_files() {
  echo "Checking for root files that have been moved to subdirectories..."
  
  for file in "${ROOT_FILES_MOVED[@]}"; do
    if [ -f "./$file" ]; then
      # Check if the file exists in its new location
      case "$file" in
        "Dockerfile")
          if [ -f "./docker/frontend/Dockerfile" ]; then
            echo "Removing root $file (already exists in docker/frontend/)"
            rm -f "./$file"
          fi
          ;;
        "docker-compose.yml")
          if [ -f "./docker/docker-compose.yml" ]; then
            echo "Removing root $file (already exists in docker/)"
            rm -f "./$file"
          fi
          ;;
        "run-fullstack.sh" | "stop-fullstack.sh" | "git-info-and-set-remote.sh")
          if [ -f "./scripts/$file" ]; then
            echo "Removing root $file (already exists in scripts/)"
            rm -f "./$file"
          fi
          ;;
        "code_map.json")
          if [ -f "./json/$file" ]; then
            echo "Removing root $file (already exists in json/)"
            rm -f "./$file"
          fi
          ;;
        *)
          if [ -f "./docs/$file" ]; then
            echo "Removing root $file (already exists in docs/)"
            rm -f "./$file"
          fi
          ;;
      esac
    fi
  done
}

# Function to clean Docker artifacts
clean_docker() {
  echo "Stopping any running Docker containers..."
  if command -v docker &> /dev/null; then
    if [ -f "./docker/docker-compose.yml" ]; then
      docker-compose -f ./docker/docker-compose.yml down -v || true
    elif [ -f "./docker-compose.yml" ]; then
      docker-compose down -v || true
    fi
    
    echo "Removing Docker volumes associated with the project..."
    docker volume ls -q | grep -i convention | xargs docker volume rm 2>/dev/null || true
  else
    echo "Docker not found, skipping Docker cleanup."
  fi
}

# Main execution
if [ "$1" == "--dry-run" ]; then
  dry_run
  exit 0
fi

echo "This will remove:"
for dir in "${DIRS_TO_REMOVE[@]}"; do
  echo "- Directories named: $dir"
done

for file in "${FILES_TO_REMOVE[@]}"; do
  echo "- Files matching: $file"
done

echo "- Docker containers and volumes related to the project"
echo "- Root files that have been moved to subdirectories"
echo

confirm

echo "Cleaning up the project..."
remove_files
clean_docker
remove_moved_root_files

echo
echo "Cleanup completed successfully!"
echo "Run 'npm install' to restore node_modules if needed."
echo

exit 0
