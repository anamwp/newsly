# Admin Options Testing

This directory contains PHPUnit tests for the Gutenberg Starter plugin's admin options functionality.

## Test Files

### 1. `test-admin-options.php`

Tests the `Options` class functionality including:

-   ✅ Class instantiation and singleton pattern
-   ✅ Admin hooks registration
-   ✅ Settings registration with WordPress Settings API
-   ✅ Admin page registration
-   ✅ Settings page callback output
-   ✅ HTML escaping and sanitization
-   ✅ Capability requirements
-   ✅ Non-admin context behavior

### 2. `test-options-settings.php`

Tests the WordPress options/settings integration:

-   ✅ Option saving and retrieval
-   ✅ Default values handling
-   ✅ Data sanitization and validation
-   ✅ Special characters handling
-   ✅ Large data handling
-   ✅ Null/false values handling
-   ✅ Option deletion
-   ✅ Multiple options isolation
-   ✅ WordPress filters integration

## Running Tests

### Prerequisites

1. **WordPress Test Environment**: Set up WordPress test environment

    ```bash
    # Install WordPress test environment
    bash bin/install-wp-tests.sh wordpress_test root '' localhost latest

    # Set environment variable
    export WP_TESTS_DIR=/tmp/wordpress-tests-lib
    ```

2. **PHPUnit**: Make sure PHPUnit is installed

    ```bash
    # Via Composer (recommended)
    composer install --dev

    # Or globally
    # See: https://phpunit.de/getting-started.html
    ```

### Running the Tests

#### Option 1: Use the Test Runner Script

```bash
# Make executable (if not already)
chmod +x tests/run-admin-tests.sh

# Run all admin options tests
./tests/run-admin-tests.sh
```

#### Option 2: Run Individual Test Files

```bash
# Run Options class tests
phpunit --bootstrap tests/bootstrap.php tests/test-admin-options.php

# Run Options settings tests
phpunit --bootstrap tests/bootstrap.php tests/test-options-settings.php

# Run all tests
phpunit --bootstrap tests/bootstrap.php tests/
```

#### Option 3: Using WordPress Scripts (if available)

```bash
# If you have wp-scripts installed
npm run test:unit
```

## Test Coverage

The tests cover the following scenarios:

### ✅ Core Functionality

-   Options class instantiation
-   Singleton pattern enforcement
-   Settings registration
-   Admin page creation

### ✅ WordPress Integration

-   Settings API integration
-   Admin hooks registration
-   Capability-based access control
-   Option storage and retrieval

### ✅ Security & Validation

-   Input sanitization
-   XSS prevention
-   Capability checking
-   Data escaping in output

### ✅ Edge Cases

-   Empty/null values
-   Special characters
-   Large data sets
-   Multiple options isolation
-   Filter integration

### ✅ User Experience

-   Default values
-   Error handling
-   Admin interface output
-   Form field generation

## Test Structure

```
tests/
├── bootstrap.php              # Test environment setup
├── test-admin-options.php     # Options class tests
├── test-options-settings.php  # Settings functionality tests
├── run-admin-tests.sh         # Test runner script
└── README.md                  # This file
```

## Example Test Output

```bash
=== Gutenberg Starter Plugin - Admin Options Tests ===

🧪 Running Admin Options Tests...
=================================

1. Running Options Class Tests...
PHPUnit 9.5.0 by Sebastian Bergmann and contributors.

....................                                    20 / 20 (100%)

Time: 00:02.543, Memory: 18.00 MB

OK (20 tests, 45 assertions)

2. Running Options Settings Tests...
PHPUnit 9.5.0 by Sebastian Bergmann and contributors.

.............                                            13 / 13 (100%)

Time: 00:01.234, Memory: 16.00 MB

OK (13 tests, 28 assertions)

=== Test Completed ===
```

## Troubleshooting

### Common Issues

1. **"Could not find WordPress test environment"**

    - Make sure `WP_TESTS_DIR` environment variable is set
    - Install WordPress test environment using `install-wp-tests.sh`

2. **"Class not found" errors**

    - Ensure the plugin is properly loaded in `bootstrap.php`
    - Check autoloader configuration

3. **"Database connection" errors**

    - Verify test database credentials
    - Ensure test database exists and is accessible

4. **"Permission denied" on test runner**
    - Make the script executable: `chmod +x tests/run-admin-tests.sh`

### Environment Variables

```bash
# Required
export WP_TESTS_DIR=/path/to/wordpress-tests-lib

# Optional (for database tests)
export WP_DB_NAME=wordpress_test
export WP_DB_USER=root
export WP_DB_PASSWORD=password
export WP_DB_HOST=localhost
```

## Adding More Tests

To add more tests for additional settings or functionality:

1. Create new test files following the naming convention: `test-[feature-name].php`
2. Extend `WP_UnitTestCase` class
3. Add setup and teardown methods
4. Write specific test methods starting with `test_`
5. Update this README with new test descriptions

Example:

```php
class NewFeatureTest extends WP_UnitTestCase {
    public function setUp() {
        parent::setUp();
        // Setup code
    }

    public function test_new_feature() {
        // Test code
        $this->assertTrue(true);
    }
}
```
