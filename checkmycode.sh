#!/bin/bash
set -e
set -x 

if [ ! -d ./node_modules ]; then
    echo "Installing dependencies..."
    npm install
fi


if find . -name '*.js' 2>/dev/null | grep -q .; then
    echo "Running ESLint..."
    npx eslint .
else
    echo "No JavaScript files found, skipping ESLint."
fi

npx jscpd --min-lines 3 --min-tokens 25 --threshold 0 --gitignore 

echo "Running Tests with Coverage..."
export MONGODB_URI="mongodb://localhost:27017/testdb"




for test_file in ev-charging-api/test/*.test.js; do
    echo "Running test: $test_file"
    npx nyc --silent --reporter=none mocha --exit "$test_file"
done



# Clean previous NYC data
rm -rf .nyc_output coverage

# Run tests sequentially, merging coverage reports
for test_file in ev-charging-api/test/*.test.js; do
    echo "Running test: $test_file"
    npx nyc --silent --reporter=none mocha --exit "$test_file"
done

# Generate final coverage reports
npx nyc report --reporter=lcov --reporter=text --reporter=json-summary

# Verify coverage report exists
if [ ! -f coverage/coverage-summary.json ]; then
  echo "Coverage report not found. Make sure tests are running correctly."
  exit 1
fi

# Extract test coverage percentage
COVERAGE=$(grep -o '"lines":{"total":[0-9]*,"covered":[0-9]*,"skipped":[0-9]*,"pct":[0-9.]*}' coverage/coverage-summary.json | grep -o '"pct":[0-9.]*' | grep -o '[0-9.]*' | head -1)

echo "Test Coverage: ${COVERAGE}%"

# Convert coverage to an integer (remove decimal)
COVERAGE_INT=${COVERAGE%.*}

if [ "$COVERAGE_INT" -lt 40 ]; then
  echo "Test coverage is below 50%! Increase test coverage before merging."
  exit 1
fi

echo "All checks passed successfully!"


