#!/bin/bash
# Script to diagnose git commit/push hanging issues and update remote URL

set -e

echo "======================================================"
echo "  GIT DIAGNOSTIC AND REMOTE UPDATE SCRIPT"
echo "======================================================"
echo

# New repository URL
NEW_REPO_URL="https://github.com/hkevin01/CONVENTION-APP.git"

# Step 1: Check for git locks
check_git_locks() {
  echo "Step 1: Checking for git locks..."
  
  LOCK_FILES=$(find .git -name "*.lock")
  if [ -n "$LOCK_FILES" ]; then
    echo "WARNING: Found git lock files:"
    echo "$LOCK_FILES"
    echo "These might be causing commit/push to hang."
    echo "Consider removing them if git operations are stuck:"
    echo "  rm -f $LOCK_FILES"
  else
    echo "No git lock files found."
  fi
  echo
}

# Step 2: Check remote configuration
check_remotes() {
  echo "Step 2: Checking git remotes..."
  
  echo "Current remotes:"
  git remote -v
  echo
  
  # Check if origin exists
  if git remote get-url origin &>/dev/null; then
    CURRENT_URL=$(git remote get-url origin)
    echo "Current origin URL: $CURRENT_URL"
    
    if [ "$CURRENT_URL" != "$NEW_REPO_URL" ]; then
      echo "Origin URL doesn't match desired URL."
      echo "Will update in Step 5."
    else
      echo "Origin URL is already set correctly."
    fi
  else
    echo "No origin remote found."
    echo "Will add in Step 5."
  fi
  echo
}

# Step 3: Check for large files
check_large_files() {
  echo "Step 3: Checking for large files that might cause hangs..."
  
  echo "Top 10 largest files in git history:"
  # This might take some time on large repos
  git rev-list --objects --all | grep -v "^[0-9a-f]\{40\} " | \
    git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
    awk '/^blob/ {print $3 " " $4}' | sort -nr | head -n 10
  
  echo
  echo "Top 10 largest files in working directory:"
  find . -type f -not -path "./.git/*" -print0 | xargs -0 du -h | sort -hr | head -n 10
  echo
}

# Step 4: Check git config
check_git_config() {
  echo "Step 4: Checking git configuration..."
  
  echo "Git user configuration:"
  git config user.name
  git config user.email
  
  echo "Checking for proxy settings:"
  git config --get http.proxy || echo "No HTTP proxy set"
  git config --get https.proxy || echo "No HTTPS proxy set"
  
  echo "Git transfer settings:"
  git config --get http.postBuffer || echo "http.postBuffer not set (default: 1 MiB)"
  echo "Recommended for large repos: git config --global http.postBuffer 524288000"
  
  echo
}

# Step 5: Update remote URL
update_remote_url() {
  echo "Step 5: Updating remote URL..."
  
  if git remote get-url origin &>/dev/null; then
    echo "Updating existing origin remote to $NEW_REPO_URL"
    git remote set-url origin "$NEW_REPO_URL"
  else
    echo "Adding origin remote with URL $NEW_REPO_URL"
    git remote add origin "$NEW_REPO_URL"
  fi
  
  echo "Current remotes after update:"
  git remote -v
  echo
}

# Step 6: Check for uncommitted changes
check_uncommitted_changes() {
  echo "Step 6: Checking for uncommitted changes..."
  
  if git diff --quiet && git diff --staged --quiet; then
    echo "No uncommitted changes found."
  else
    echo "You have uncommitted changes:"
    git status --short
    echo
    echo "Consider committing these changes before pushing:"
    echo "  git add ."
    echo "  git commit -m 'Your commit message'"
  fi
  echo
}

# Step 7: Provide push commands
show_push_commands() {
  echo "Step 7: Push commands..."
  
  echo "To push to the updated remote, use:"
  echo "  git push -u origin main"
  echo
  echo "If push hangs, try with verbose output:"
  echo "  GIT_TRACE=1 git push -u origin main"
  echo
  echo "If still having issues, try limiting speed:"
  echo "  git push -u origin main --verbose --progress"
  echo
}

# Run all checks
check_git_locks
check_remotes
check_large_files
check_git_config
update_remote_url
check_uncommitted_changes
show_push_commands

echo "Diagnostic complete. The remote URL has been updated to:"
echo "  $NEW_REPO_URL"
echo
echo "To make this script executable, run:"
echo "  chmod +x scripts/git-diagnostic.sh"
echo
echo "Then run it with:"
echo "  ./scripts/git-diagnostic.sh"
echo
