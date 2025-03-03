#!/bin/bash
set -e  # Exit immediately if any command fails
set -x

# Ensure dependencies are installed
if [ ! -d "./node_modules" ]; then
  echo "Please run 'npm install' first."
  exit 1
fi

# Start MongoDB in the background
echo "Starting MongoDB..."
"C:/mongodb/bin/mongod" --dbpath "C:/mongodb/data" > /dev/null 2>&1 &

# Wait for MongoDB to initialize
sleep 5  

# Run ESLint only if there are .js files
if find . -name "*.js" | grep -q .; then
  echo "Running ESLint..."
  npx eslint .
else
  echo "No JavaScript files found. Skipping ESLint."
fi

# Run Tests with Coverage
echo "Running Tests with Coverage..."
npx nyc --reporter=lcov --reporter=text mocha --exit ev-charging-api/test/chargePoint.test.js
mocha --exit ev-charging-api/test/chargeStation.test.js
mocha --exit ev-charging-api/test/connector.test.js
mocha --exit ev-charging-api/test/location.test.js

# Extract Only the First Coverage Percentage
COVERAGE=$(grep -o '"lines":{"total":[0-9]*,"covered":[0-9]*,"skipped":[0-9]*,"pct":[0-9.]*}' coverage/coverage-summary.json | grep -o '"pct":[0-9.]*' | grep -o '[0-9.]*' | head -1)
echo "Test Coverage: ${COVERAGE}%"

# Convert Coverage to Integer (remove decimal part)
COVERAGE_INT=${COVERAGE%.*}

if [ "$COVERAGE_INT" -lt 50 ]; then
  echo "Test coverage is below 80%! Increase test coverage before merging."
  exit 1
fi

echo "✅ Check Complete :)"

