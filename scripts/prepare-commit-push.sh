#!/bin/bash
# Script to prepare, commit and push project restructuring changes

set -e

# Enable debug mode if DEBUG=1 is set
if [ "${DEBUG:-0}" = "1" ]; then
  set -x  # Print each command before executing
  export GIT_TRACE=1
  echo "Debug mode enabled"
fi

echo "======================================================"
echo "  PREPARE COMMIT AND PUSH SCRIPT"
echo "======================================================"
echo "This script will optimize git settings and prepare your"
echo "project restructuring changes for commit and push."
echo

# Error handling function
handle_error() {
  local exit_code=$?
  echo "ERROR: Command failed with exit code $exit_code"
  echo "Failed command: $BASH_COMMAND"
  echo
  echo "Troubleshooting suggestions:"
  echo "- Check if you have permissions to write to the repository"
  echo "- Ensure you have a stable internet connection"
  echo "- Try running with DEBUG=1 for more detailed output"
  echo "- Consider running git commands manually with --verbose flag"
  exit $exit_code
}

# Set error trap
trap handle_error ERR

# Set larger buffer size for git to handle large pushes
set_git_buffer() {
  echo "Setting git http.postBuffer to 524MB for handling large pushes..."
  git config --global http.postBuffer 524288000
  echo "✓ Done."
  echo
}

# Make sure node_modules is ignored
check_gitignore() {
  echo "Ensuring node_modules is properly ignored..."
  if ! grep -q "^node_modules/" .gitignore; then
    echo "Adding node_modules/ to .gitignore"
    echo "node_modules/" >> .gitignore
  else
    echo "✓ node_modules is already in .gitignore"
  fi
  echo "✓ Done."
  echo
}

# Prepare commit message
prepare_commit() {
  echo "Preparing commit message for project restructuring..."
  
  cat > /tmp/commit_msg.txt << EOL
Restructure project: Organize files into appropriate directories

- Move Docker files to docker/ directory
- Move documentation to docs/ directory
- Move scripts to scripts/ directory
- Create JSON config directory
- Update file references and imports
- Fix Dockerfile permissions and paths
- Improve script organization and execution
EOL

  echo "✓ Commit message prepared at /tmp/commit_msg.txt"
  echo
}

# Execute git commands
execute_git_commands() {
  echo "======================================================"
  echo "  EXECUTING GIT COMMANDS"
  echo "======================================================"
  
  echo "Would you like to execute the git commands now? (y/n)"
  read -p "> " execute_choice
  
  if [[ "$execute_choice" != "y" && "$execute_choice" != "Y" ]]; then
    echo "Skipping command execution. You can run these commands manually:"
    echo "  git add ."
    echo "  git commit -F /tmp/commit_msg.txt"
    echo "  git push -u origin main"
    return 0
  fi
  
  echo
  echo "Step 1/3: Adding all changes..."
  git add .
  echo "✓ All changes staged."
  
  echo
  echo "Step 2/3: Committing changes..."
  git commit -F /tmp/commit_msg.txt
  echo "✓ Changes committed."
  
  echo
  echo "Step 3/3: Pushing to remote repository..."
  echo "Would you like to try the normal push or verbose push with progress? (normal/verbose)"
  read -p "> " push_choice
  
  if [[ "$push_choice" == "verbose" ]]; then
    echo "Pushing with verbose output and progress..."
    git push -u origin main --verbose --progress
  else
    echo "Pushing normally..."
    git push -u origin main
  fi
  
  echo "✓ Push complete!"
  return 0
}

# Function to show alternative steps if push fails
show_alternative_steps() {
  echo "======================================================"
  echo "  ALTERNATIVE APPROACHES IF PUSH FAILS"
  echo "======================================================"
  echo
  echo "If the push operation fails or hangs, try these alternatives:"
  echo
  echo "1. Push with verbose output:"
  echo "   GIT_TRACE=1 git push -u origin main"
  echo
  echo "2. Push with progress reporting and limited speed:"
  echo "   git push -u origin main --verbose --progress"
  echo
  echo "3. Try pushing just the restructuring commit first:"
  echo "   git push -u origin main --force-with-lease"
  echo
  echo "4. As a last resort, create a fresh clone and copy files:"
  echo "   git clone https://github.com/hkevin01/CONVENTION-APP.git new-repo"
  echo "   cp -r <restructured_files> new-repo/"
  echo "   cd new-repo && git add . && git commit && git push"
  echo
}

# Main function
main() {
  # Check if we're in a git repository
  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "ERROR: Not in a git repository. Please run this script from the root of your git repository."
    exit 1
  fi
  
  # Run all functions
  set_git_buffer
  check_gitignore
  prepare_commit
  execute_git_commands || show_alternative_steps
  
  echo "Script execution completed."
  echo
}

# Execute the main function
main "$@"

exit 0
