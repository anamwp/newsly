#!/bin/bash

# Script to run admin-related tests for Gutenberg Starter plugin
# Usage: ./tests/run-admin-tests.sh

echo "🧪 Running Gutenberg Starter Admin Tests..."
echo "============================================="

# Check if we're in the right directory
if [ ! -f "gutenberg-starter.php" ]; then
    echo "❌ Error: Please run this script from the plugin root directory"
    exit 1
fi

# Check if PHPUnit is available
if [ ! -f "vendor/bin/phpunit" ]; then
    echo "❌ Error: PHPUnit not found. Please run 'composer install' first"
    exit 1
fi

# Check if WordPress test environment is set up
if [ ! -f "tests/bootstrap.php" ]; then
    echo "❌ Error: WordPress test environment not found"
    echo "   Please run './setup-wp-tests.sh' to set up the test environment"
    exit 1
fi

echo "📋 Available test suites:"
echo "  1. All tests"
echo "  2. Admin Options tests (AdminOptionsTest.php)"
echo "  3. Settings API tests (OptionsSettingsTest.php)"
echo "  4. Specific test file"
echo ""

# Run all tests by default or accept parameter
case "${1:-all}" in
    "1"|"all")
        echo "🏃 Running all admin tests..."
        ./vendor/bin/phpunit --configuration phpunit.xml.dist --verbose
        ;;
    "2"|"admin"|"options")
        echo "🏃 Running Admin Options tests..."
        ./vendor/bin/phpunit --configuration phpunit.xml.dist tests/AdminOptionsTest.php --verbose
        ;;
    "3"|"settings"|"api")
        echo "🏃 Running Settings API tests..."
        ./vendor/bin/phpunit --configuration phpunit.xml.dist tests/OptionsSettingsTest.php --verbose
        ;;
    *)
        if [ -f "tests/$1" ]; then
            echo "🏃 Running specific test file: $1"
            ./vendor/bin/phpunit --configuration phpunit.xml.dist "tests/$1" --verbose
        else
            echo "❌ Error: Test file 'tests/$1' not found"
            echo ""
            echo "Available test files:"
            ls -1 tests/*Test.php 2>/dev/null || echo "  No test files found"
            exit 1
        fi
        ;;
esac

echo ""
echo "✅ Test execution completed!"
echo ""
echo "📊 Test Summary:"
echo "  • AdminOptionsTest.php: Tests the main Options class functionality (12 tests)"
echo "  • OptionsSettingsTest.php: Tests WordPress Settings API integration (12 tests)"
echo ""
echo "🔧 To run individual test methods:"
echo "  ./vendor/bin/phpunit --filter test_method_name tests/AdminOptionsTest.php"
echo ""
echo "📖 For more PHPUnit options:"
echo "  ./vendor/bin/phpunit --help"
