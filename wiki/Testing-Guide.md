# Testing Guide

Three layers of tests: Jest (JS unit), PHPUnit (PHP), Playwright (e2e, browser-driven).

## Jest

```
npm run jest
npm run jest -- --coverage
```

Run a single block's tests with coverage scoped to just its `edit.js`/`save.js`:

```
npx jest src/blocks/<block> --coverage --collectCoverageFrom="src/blocks/<block>/edit.js" --collectCoverageFrom="src/blocks/<block>/save.js"
```

Every audited block (`category-post`, `featured-posts`, `latest-posts`, `smart-category-posts`) is held at 100% statements/branches/functions/lines on `edit.js` and `save.js`. Some blocks also have dedicated regression suites beyond the coverage numbers — e.g. `category-post/save.ssr-regression.test.js` and `category-post/save.category-change-regression.test.js` — see [Known Issues & Fixes](Known-Issues-And-Fixes) for what they lock in and why they exist as separate files.

### The two `__mocks__` folders

This repo has two folders named `__mocks__` and **both are needed** — they serve different purposes and are easy to confuse.

**1. Root `__mocks__/`** (`/newsly/__mocks__/`) — Jest's standard automatic module mocking. Jest looks here automatically to resolve `@wordpress/*` scoped packages (`api-fetch.js`, `block-editor.js`, `components.js`, `data.js`, `element.js`, `i18n.js`, `icons.js`) and `classnames.js`. **This folder must stay at the project root** (next to `package.json`) — that's a Jest convention, not a choice.

Note: `__mocks__/@wordpress/element.js` strips out `createElement`/`renderToString` entirely for every test file, automatically, with no `jest.mock()` call needed. That means **no ordinary unit test in this suite can catch a real-SSR regression** (e.g. a component that serializes to an empty string via `renderToString` but renders fine under the mock) — see the `React.memo` bug in [Known Issues & Fixes](Known-Issues-And-Fixes) for a real example this bit. Any test that needs the *real* SSR path must bypass the mock explicitly:

```js
const { renderToString, createElement } = jest.requireActual('@wordpress/element');
```

**2. `src/blocks/__mocks__/`** — reusable mock helper functions for local components, organized by WordPress package, with its own `README.md`/`STRUCTURE.md`. This is project convention/organization, not a Jest requirement.

**Resolution order**: inline `jest.mock()` in a test file (highest priority) → root `__mocks__/` (automatic) → the real npm package (fallback).

## PHP Unit

There's no PHP feature code under unit test right now — `tests/test-sample.php` is kept only as a canary to confirm the WP test environment/PHPUnit toolchain still works, so real tests can be added later without first debugging the harness. See `tests/README.md`.

1. Check phpcs / run once: `./vendor/bin/phpunit`
2. If that fails, set up the WP test environment: `bin/install-wp-tests.sh newsly root '' localhost 6.4.3`
3. After setup, run the sanity check:
   ```
   ./tests/run-tests.sh
   # or directly:
   vendor/bin/phpunit --bootstrap tests/bootstrap.php tests/test-sample.php --verbose
   ```
4. If it still doesn't work, re-run `composer install`.

Coverage config (`phpunit.xml.dist`) includes `./includes/` and `./src/`, reporting to `coverage-html/`, `coverage.txt`, and `coverage.xml`.

## Playwright (e2e)

Copy `.env.example` to `.env` and fill in `WP_ADMIN_USERNAME`, `WP_ADMIN_PASSWORD`, and `WP_BASE_URL` (your Local site URL) before running e2e tests — they log into a real WordPress install.

```
npx playwright test tests/e2e/simple.spec.js --headed   # run one spec, headed
npx playwright test                                      # run everything
npx playwright test tests/e2e/basic.spec.js               # run one file
npx playwright test --headed                              # visible browser
npx playwright test --debug                                # debug mode
npx playwright test --ui                                   # interactive UI mode
npx playwright test --list                                 # list available tests
npx playwright show-report                                 # view last report
```

### What the e2e specs actually check

Prefer specs with real `expect()` assertions over specs that only `console.log`/soft-check visibility — a soft-checked spec can pass while the feature is completely broken. This happened for real: `block-test-featured-posts.spec.js` had zero `expect()` assertions for a period during which the block's frontend output was actually empty (see the `React.memo` SSR bug in [Known Issues & Fixes](Known-Issues-And-Fixes)) and the test suite never caught it. When writing or reviewing a spec, check that it asserts on real DOM state/content, not just "did this element exist at some point."
