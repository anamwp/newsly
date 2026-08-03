#!/bin/bash

# Minimal PHPUnit sanity-check runner for Newsly.
# Confirms bootstrap.php + PHPUnit + the WP test environment are wired up
# correctly, so real unit tests have a known-good foundation to build on.
# Usage: ./tests/run-tests.sh

echo "=== Newsly - PHPUnit Sanity Check ==="
echo ""

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEST_DIR="$PLUGIN_DIR/tests"

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
echo "🧪 Running sample test to verify setup..."
echo "================================="
echo ""

if $PHPUNIT_CMD --bootstrap "$TEST_DIR/bootstrap.php" "$TEST_DIR/test-sample.php" --verbose; then
    echo "✅ Test environment is working!"
else
    echo "❌ Test environment has issues. Please check the error above."
    exit 1
fi

echo ""
echo "=== Test Completed ==="
