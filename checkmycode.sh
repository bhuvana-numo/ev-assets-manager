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

# Run tests with coverage
npx nyc --all --reporter=text npm run test

npx nyc check-coverage --functions 100 --branches 100 --lines 100

echo "Check Complete :)"
