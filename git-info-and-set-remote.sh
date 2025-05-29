#!/bin/bash
# Script to print git info, set remote to your repo, and log output

OUTPUT="output.log"
REPO_URL="https://github.com/hkevin01/CONVENTION-APP.git"

{
  echo "==== GIT STATUS ===="
  git status

  echo
  echo "==== GIT REMOTE -V ===="
  git remote -v

  echo
  echo "==== GIT BRANCHES ===="
  git branch -a

  echo
  echo "==== GIT CONFIG (user) ===="
  git config --get user.name
  git config --get user.email

  echo
  echo "==== GIT LOG (last 5 commits) ===="
  git log --oneline -5

  echo
  echo "==== GIT SHOW REMOTE ORIGIN URL ===="
  git remote get-url origin || echo "No origin remote set"

  echo
  echo "==== SETTING REMOTE ORIGIN TO $REPO_URL ===="
  git remote remove origin 2>/dev/null || true
  git remote add origin "$REPO_URL"
  git remote set-url origin "$REPO_URL"
  git remote -v

  echo
  echo "==== GIT FETCH TEST ===="
  git fetch origin --dry-run

} | tee "$OUTPUT"

echo "All git info and actions have been logged to $OUTPUT"

# After running this script, your git remote is now set to:
#   https://github.com/hkevin01/CONVENTION-APP.git

# To push your local changes to the new remote, run:
#   git add .
#   git commit -m "your commit message"
#   git push origin main

# You can verify the remote with:
#   git remote -v
