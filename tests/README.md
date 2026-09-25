# PHP Unit Tests

- `test-block-registration.php` - all four block types register from
  `build/`; no blocks register and the missing-build admin notice is
  hooked (admins only) when `build/` is absent. Registration is pointed
  at `tests/fixtures/build/` via the `newsly_build_path` filter, since
  the PHP CI job never runs `npm run build`.
- `test-post-lists-tab-ajax.php` - the Post Lists Tab AJAX handler
  rejects a missing or invalid nonce, caps results at 9 posts, and
  escapes post titles in its output.

E2E coverage for the actual blocks (Category Post, Featured Posts,
Latest Posts) lives in `tests/e2e/` and runs via Playwright - see
`playwright.config.js`.

## Prerequisites

1. **WordPress Test Environment**

    ```bash
    bash bin/install-wp-tests.sh wordpress_test root '' localhost latest
    export WP_TESTS_DIR=/tmp/wordpress-tests-lib
    ```

2. **PHPUnit**

    ```bash
    composer install --dev
    ```

## Running the Sanity Check

```bash
chmod +x tests/run-tests.sh
./tests/run-tests.sh
```

Or directly:

```bash
phpunit --bootstrap tests/bootstrap.php tests/test-sample.php
```

## Adding Real Tests

1. Create new test files following the naming convention: `test-[feature-name].php`
2. Extend `WP_UnitTestCase`
3. Add `set_up()`/`tear_down()` as needed
4. Write test methods starting with `test_`

```php
class NewFeatureTest extends WP_UnitTestCase {
    public function set_up() {
        parent::set_up();
        // Setup code
    }

    public function test_new_feature() {
        // Test code
        $this->assertTrue( true );
    }
}
```

## Troubleshooting

- **"Could not find WordPress test environment"** - set `WP_TESTS_DIR` and install it via `install-wp-tests.sh`.
- **"Class not found" errors** - check the plugin loads correctly in `bootstrap.php` and the composer autoloader is up to date.
- **"Permission denied" on the runner** - `chmod +x tests/run-tests.sh`.
