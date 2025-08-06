#!/bin/bash

# WordPress Test Environment Setup Script
# This script sets up the WordPress testing environment for PHPUnit tests

echo "=== WordPress Test Environment Setup ==="
echo ""

# Configuration
DB_NAME=${1-wordpress_test}
DB_USER=${2-root}
DB_PASS=${3-''}
DB_HOST=${4-localhost}
WP_VERSION=${5-latest}
TESTS_DIR=${WP_TESTS_DIR-/tmp/wordpress-tests-lib}

echo "Configuration:"
echo "- Database Name: $DB_NAME"
echo "- Database User: $DB_USER"
echo "- Database Host: $DB_HOST"
echo "- WordPress Version: $WP_VERSION"
echo "- Tests Directory: $TESTS_DIR"
echo ""

# Check if tests directory already exists
if [ -d "$TESTS_DIR" ]; then
    echo "✅ WordPress tests directory already exists at: $TESTS_DIR"
    echo "✅ Test environment appears to be set up"
    echo ""
    echo "To use this environment, run:"
    echo "export WP_TESTS_DIR=$TESTS_DIR"
    echo ""
    exit 0
fi

# Download the install script if it doesn't exist
if [ ! -f "install-wp-tests.sh" ]; then
    echo "📥 Downloading WordPress test installation script..."
    curl -O https://raw.githubusercontent.com/wp-cli/sample-plugin/master/bin/install-wp-tests.sh
    chmod +x install-wp-tests.sh
    echo "✅ Download complete"
    echo ""
fi

# Check if database connection is possible
echo "🔗 Testing database connection..."
if command -v mysql &> /dev/null; then
    if mysql -u"$DB_USER" -p"$DB_PASS" -h"$DB_HOST" -e "SELECT 1;" &> /dev/null; then
        echo "✅ Database connection successful"
    else
        echo "❌ Cannot connect to database"
        echo "Please check your database credentials:"
        echo "  Database User: $DB_USER"
        echo "  Database Password: [hidden]"
        echo "  Database Host: $DB_HOST"
        echo ""
        echo "Make sure MySQL is running and credentials are correct."
        exit 1
    fi
else
    echo "⚠️  MySQL client not found, skipping connection test"
fi

echo ""

# Run the installation
echo "🚀 Installing WordPress test environment..."
echo "This may take a few minutes..."
echo ""

if ./install-wp-tests.sh "$DB_NAME" "$DB_USER" "$DB_PASS" "$DB_HOST" "$WP_VERSION"; then
    echo ""
    echo "✅ WordPress test environment installed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Export the environment variable:"
    echo "   export WP_TESTS_DIR=$TESTS_DIR"
    echo ""
    echo "2. Add to your shell profile (optional):"
    echo "   echo 'export WP_TESTS_DIR=$TESTS_DIR' >> ~/.bashrc"
    echo "   # or for zsh:"
    echo "   echo 'export WP_TESTS_DIR=$TESTS_DIR' >> ~/.zshrc"
    echo ""
    echo "3. Run the tests:"
    echo "   ./tests/run-admin-tests.sh"
    echo ""
    
    # Set the environment variable for this session
    export WP_TESTS_DIR="$TESTS_DIR"
    echo "✅ WP_TESTS_DIR set for current session: $WP_TESTS_DIR"
    
else
    echo ""
    echo "❌ WordPress test environment installation failed"
    echo "Please check the error messages above and try again"
    exit 1
fi
