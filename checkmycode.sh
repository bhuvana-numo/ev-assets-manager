#!/bin/bash

# Exit on any error and enable debug mode
set -e
set -x 

# Ensure dependencies are installed
if [ ! -d ./node_modules ]; then
    echo "Installing dependencies..."
    npm install
fi

# Wait for MongoDB to be ready
echo " Waiting for MongoDB to be ready..."
until nc -z localhost 27017; do
  sleep 1
done
echo "MongoDB is up and running!"

# Check for JavaScript files before running ESLint
if find . -name '*.js' 2>/dev/null | grep -q .; then
    echo "Running ESLint..."
    npx eslint .
else
    echo "No JavaScript files found, skipping ESLint."
fi

# Run tests with coverage
echo "Running Tests with Coverage..."
export MONGODB_URI="mongodb://localhost:27017/testdb"  # Ensure MongoDB URI is set
npx nyc --reporter=lcov --reporter=text mocha --exit ev-charging-api/test/chargePoint.test.js
npx mocha --exit ev-charging-api/test/chargeStation.test.js
npx mocha --exit ev-charging-api/test/connector.test.js
npx mocha --exit ev-charging-api/test/location.test.js

# Extract test coverage percentage
COVERAGE=$(grep -o '"lines":{"total":[0-9]*,"covered":[0-9]*,"skipped":[0-9]*,"pct":[0-9.]*}' coverage/coverage-summary.json | grep -o '"pct":[0-9.]*' | grep -o '[0-9.]*' | head -1)

# Handle missing coverage file scenario
if [ -z "$COVERAGE" ]; then
  echo " Coverage report not found. Make sure tests are running correctly."
  exit 1
fi

echo "Test Coverage: ${COVERAGE}%"

# Convert coverage to an integer (remove decimal)
COVERAGE_INT=${COVERAGE%.*}

if [ "$COVERAGE_INT" -lt 50 ]; then
  echo "Test coverage is below 50%! Increase test coverage before merging."
  exit 1
fi

echo " All checks passed successfully!"
