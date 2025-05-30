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
  
  push_success=false
  
  if [[ "$push_choice" == "verbose" ]]; then
    echo "Pushing with verbose output and progress..."
    if git push -u origin main --verbose --progress; then
      push_success=true
    fi
  else
    echo "Pushing normally..."
    if git push -u origin main; then
      push_success=true
    fi
  fi
  
  if [ "$push_success" = true ]; then
    echo "✓ Push complete!"
    return 0
  else
    echo "! Push failed. Let's handle this situation."
    handle_push_failure
    return 1
  fi
}

# Function to handle push failure
handle_push_failure() {
  echo
  echo "======================================================"
  echo "  HANDLING PUSH FAILURE"
  echo "======================================================"
  echo
  echo "Your push was rejected. This typically happens when:"
  echo "1. The remote repository has changes you don't have locally"
  echo "2. Another branch was merged to main since your last pull"
  echo
  echo "Choose how you want to proceed:"
  echo "1) Pull changes and merge (git pull)"
  echo "2) Pull changes and rebase (git pull --rebase)"
  echo "3) Force push your changes (WARNING: overwrites remote history)"
  echo "4) Exit without pushing (handle manually later)"
  echo
  read -p "Select an option (1-4): " resolve_choice
  
  case $resolve_choice in
    1)
      echo "Pulling changes and merging..."
      git pull origin main
      echo "Now trying to push again..."
      git push -u origin main
      ;;
    2)
      echo "Pulling changes with rebase..."
      git pull --rebase origin main
      echo "Now trying to push again..."
      git push -u origin main
      ;;
    3)
      echo "WARNING: Force pushing will overwrite remote changes!"
      echo "This is potentially destructive if others have based work on those changes."
      read -p "Are you ABSOLUTELY sure? (yes/no): " force_confirm
      if [[ "$force_confirm" == "yes" ]]; then
        echo "Force pushing changes..."
        git push -u origin main --force-with-lease
      else
        echo "Force push cancelled."
      fi
      ;;
    4)
      echo "Exiting without pushing. You can resolve this manually with:"
      echo "  git pull origin main         # To merge remote changes"
      echo "  git pull --rebase origin main # To rebase on remote changes"
      echo "  git push -u origin main --force-with-lease # To force push (use with caution)"
      ;;
    *)
      echo "Invalid option. Exiting without pushing."
      ;;
  esac
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
