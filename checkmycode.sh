#!/bin/bash
set -e

[ ! -d "./node_modules" ] && echo "Please npm install first." && exit 1

# Run ESLint only if there are .js files
if find . -name "*.js" | grep -q .; then
  npx eslint .
else
  echo "No JavaScript files found. Skipping ESLint."
fi


# Run security audit
npm audit



echo "Check Complete :)"
