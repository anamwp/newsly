#!/bin/bash

# Test runner script for Gutenberg Starter Plugin
# This script helps run PHPUnit tests for the admin options functionality

echo "=== Gutenberg Starter Plugin - Admin Options Tests ==="
echo ""

# Get the plugin directory
PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEST_DIR="$PLUGIN_DIR/tests"

echo "Plugin Directory: $PLUGIN_DIR"
echo "Test Directory: $TEST_DIR"
echo ""

# Check if PHPUnit is available
PHPUNIT_CMD=""
if [ -f "$PLUGIN_DIR/vendor/bin/phpunit" ]; then
    PHPUNIT_CMD="$PLUGIN_DIR/vendor/bin/phpunit"
    echo "✅ Found PHPUnit at: $PHPUNIT_CMD"
elif command -v phpunit &> /dev/null; then
    PHPUNIT_CMD="phpunit"
    echo "✅ Found PHPUnit in system PATH"
else
    echo "❌ PHPUnit is not installed"
    echo "Please install PHPUnit via Composer:"
    echo "  composer install --dev"
    echo "Or install globally: https://phpunit.de/getting-started.html"
    exit 1
fi

# Check if WordPress test environment is set up
if [ -z "$WP_TESTS_DIR" ]; then
    echo "⚠️  WP_TESTS_DIR environment variable is not set"
    echo "Trying to use default location: /tmp/wordpress-tests-lib"
    export WP_TESTS_DIR="/tmp/wordpress-tests-lib"
    echo ""
    
    if [ ! -d "$WP_TESTS_DIR" ]; then
        echo "❌ WordPress test environment not found at $WP_TESTS_DIR"
        echo "Please set up WordPress test environment first:"
        echo ""
        echo "1. Download install script:"
        echo "   curl -O https://raw.githubusercontent.com/wp-cli/sample-plugin/master/bin/install-wp-tests.sh"
        echo ""
        echo "2. Make it executable:"
        echo "   chmod +x install-wp-tests.sh"
        echo ""
        echo "3. Run installation:"
        echo "   ./install-wp-tests.sh wordpress_test root '' localhost latest"
        echo ""
        echo "4. Export environment variable:"
        echo "   export WP_TESTS_DIR=/tmp/wordpress-tests-lib"
        echo ""
        exit 1
    fi
else
    echo "✅ Using WP_TESTS_DIR: $WP_TESTS_DIR"
fi

echo ""

# Test if we can run a simple test first
echo "🧪 Testing PHPUnit environment..."
echo "================================="
echo ""

echo "Running sample test to verify setup..."
if $PHPUNIT_CMD --bootstrap "$TEST_DIR/bootstrap.php" "$TEST_DIR/test-sample.php" --verbose; then
    echo "✅ Test environment is working!"
else
    echo "❌ Test environment has issues. Please check the error above."
    exit 1
fi

echo ""
echo "🧪 Running Admin Options Tests..."
echo "================================="

echo ""
echo "1. Running Options Class Tests..."
echo "-----------------------------------"
if $PHPUNIT_CMD --bootstrap "$TEST_DIR/bootstrap.php" "$TEST_DIR/test-admin-options.php" --verbose; then
    echo "✅ Options Class Tests Passed"
else
    echo "❌ Options Class Tests Failed"
fi

echo ""
echo "2. Running Options Settings Tests..."
echo "------------------------------------"
if $PHPUNIT_CMD --bootstrap "$TEST_DIR/bootstrap.php" "$TEST_DIR/test-options-settings.php" --verbose; then
    echo "✅ Options Settings Tests Passed"
else
    echo "❌ Options Settings Tests Failed"
fi

echo ""
echo "3. Running All Admin Tests..."
echo "-----------------------------"
$PHPUNIT_CMD --bootstrap "$TEST_DIR/bootstrap.php" "$TEST_DIR/test-admin-options.php" "$TEST_DIR/test-options-settings.php" --verbose

echo ""
echo "=== Test Completed ==="
