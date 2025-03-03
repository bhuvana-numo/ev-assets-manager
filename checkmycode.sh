#!/bin/bash

# Exit on any error
set -e
set -x 

# Check if node_modules exists; if not, install dependencies
if [ ! -d ./node_modules ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start MongoDB based on OS
echo "Starting MongoDB..."
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Running on Linux..."
    sudo systemctl start mongod  # FIXED: Correct MongoDB service name
    sleep 5  # Wait for MongoDB to be ready
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    echo "Running on Windows..."
    C:/mongodb/bin/mongod --dbpath C:/mongodb/data &
    sleep 5  # Wait for MongoDB to be ready
else
    echo "Unsupported OS: $OSTYPE"
    exit 1
fi

# Check for JavaScript files before running ESLint
if find . -name '*.js' 2>/dev/null | grep -q .; then
    echo "Running ESLint..."
    npx eslint .
else
    echo "No JavaScript files found, skipping ESLint."
fi

# Run tests with coverage
echo "Running Tests with Coverage..."
npx nyc --reporter=lcov --reporter=text mocha --exit ev-charging-api/test/chargePoint.test.js
npx mocha --exit ev-charging-api/test/chargeStation.test.js
npx mocha --exit ev-charging-api/test/connector.test.js
npx mocha --exit ev-charging-api/test/location.test.js

# Extract test coverage percentage
COVERAGE=$(grep -o '"lines":{"total":[0-9]*,"covered":[0-9]*,"skipped":[0-9]*,"pct":[0-9.]*}' coverage/coverage-summary.json | grep -o '"pct":[0-9.]*' | grep -o '[0-9.]*' | head -1)
echo "Test Coverage: ${COVERAGE}%"

# Convert coverage to integer (remove decimal)
COVERAGE_INT=${COVERAGE%.*}

if [ "$COVERAGE_INT" -lt 50 ]; then
  echo "Test coverage is below 50%! Increase test coverage before merging."
  exit 1
fi

echo "✅ Check Complete :)"
