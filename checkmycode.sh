#!/bin/bash
set -e

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ ! -f "package-lock.json" ]; then
  echo "Please run 'npm install' first."
  exit 1
fi

# Run ESLint only if relevant files exist
if find . -name "*.js" -o -name "*.mjs" -o -name "*.cjs" | grep -q .; then
  npx eslint .
else
  echo "No JavaScript/TypeScript files found. Skipping ESLint."
fi

echo "✅ Check Complete :)"
