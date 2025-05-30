#!/bin/bash
# Script to create JSON folder and organize JSON files

set -e

# Create the JSON folder if it doesn't exist
mkdir -p ../json

# Move code_map.json to the JSON folder if it exists in the root
if [ -f "../code_map.json" ]; then
  echo "Moving code_map.json to json/ directory..."
  mv ../code_map.json ../json/code_map.json
fi

echo "JSON folder structure created successfully!"
exit 0
