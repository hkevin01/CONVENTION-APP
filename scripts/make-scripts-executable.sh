#!/bin/bash
# Script to make all scripts in the scripts directory and root scripts executable

set -e

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
echo "Making all scripts executable..."

# Find all .sh files in the scripts directory and make them executable
find "$SCRIPT_DIR" -name "*.sh" -type f -exec chmod +x {} \;

# Make root shell scripts executable too
find "$PROJECT_ROOT" -maxdepth 1 -name "*.sh" -type f -exec chmod +x {} \;

echo "The following scripts are now executable:"
echo "In scripts directory:"
find "$SCRIPT_DIR" -name "*.sh" -type f -ls | awk '{print $11, $3}'
echo "In project root:"
find "$PROJECT_ROOT" -maxdepth 1 -name "*.sh" -type f -ls | awk '{print $11, $3}'

echo "Done!"
echo ""
echo "To commit all your project restructuring changes:"
echo "  git add ."
echo "  git commit -m 'Restructure project: Move files to appropriate directories and improve organization'"
echo "  git push -u origin main"
echo ""
echo "If git push hangs, try:"
echo "  git config --global http.postBuffer 524288000"
echo "  GIT_TRACE=1 git push -u origin main --verbose"
echo ""
