# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-09-25

### Added

- `npm run plugin-zip` (`bin/build-plugin-zip.sh`), a repeatable local build of
  the WordPress.org-submission-ready zip, mirroring what the release workflow
  packages.
- A real PHPUnit suite: block registration (all four block types, and the
  missing-build admin notice), and Post Lists Tab AJAX handler coverage
  (nonce rejection, the 9-post cap, output escaping) - replacing the
  placeholder scaffold test.
- A `newsly_build_path` filter on `Blocks\Block`, so tests (and anyone else)
  can point block registration at a different build directory without
  patching the class.
- Release notes are now pulled from this changelog's per-version section,
  instead of being auto-generated.

### Changed

- Plugin URI and Author URI updated to `https://anamhossain.dev/` and the
  wordpress.org profile page.
- `composer.json` and `composer.lock` now ship inside the distributed zip
  alongside `vendor/`, so the Composer autoloader has a manifest instead of a
  bare `vendor/` directory.

### Fixed

- `readme.txt`'s "Tested up to" bumped from 7.0 to 7.1.
- `bin/install-wp-tests.sh` and `setup-wp-tests.sh` no longer ship in the
  distributed zip - both are WP-CLI test-scaffold scripts, not plugin code,
  and WordPress.org's Plugin Check rejects `.sh` files.
- The Post Lists Tab AJAX handler's bare `die()` (after
  `wp_send_json_error()`, and at the end of the callback) replaced with
  `wp_die()`, the WordPress-correct pattern for AJAX handlers - the bare
  `die()` also made the handler untestable under `WP_Ajax_UnitTestCase`.

## [1.0.0] - 2026-09-25

### Added

- Four Gutenberg blocks: Category Post, Featured Posts, Latest Posts, and Post
  Lists Tab.
- AJAX-driven category tab switching for the Post Lists Tab block, backed by a
  nonce-protected `admin-ajax.php` endpoint.
- Keyboard-accessible tab navigation and ARIA attributes across the category
  tab UI.
- A Jest unit test suite (242 tests) covering block `edit`/`save`/sidebar-control
  behaviour, and a Playwright end-to-end suite exercising the blocks against a
  live WordPress install.
- A PHPUnit scaffold wired to the standard WordPress test harness.
- A GitHub Actions CI workflow running PHPCS and PHPUnit (PHP 8.0-8.3) plus
  Jest on every push to `main`/`dev` and on pull requests. Playwright runs
  manually only (`workflow_dispatch`), since it needs a live WordPress
  instance the workflow doesn't stand up.
- A release workflow that builds, packages and attaches a zip to a GitHub
  release when a `v*` tag is pushed, plus matching build/install steps in
  both WP Engine deploy workflows so `build/` and `vendor/` exist on the
  target.
- A capability-checked admin notice when `build/` is missing, instead of the
  plugin silently registering zero blocks.
- WP-CLI-driven POT generation (`wp i18n make-pot`/`make-json`) and
  `wp_set_script_translations()` wiring, so JS strings actually resolve at
  runtime.
- `LICENSE` (GPLv2) and this changelog.

### Changed

- Reworked `.phpcs.xml.dist` into a working ruleset: correct prefixes and text
  domain, a PHP 8.0+ compatibility target, and `minimum_supported_wp_version`
  matching `readme.txt`. Added `composer lint:php`/`lint:fix` scripts.
- Brought the plugin header, `readme.txt`, `package.json` and `composer.json`
  version numbers in line with each other.
- Bumped the minimum required WordPress version to 6.1, needed for
  `wp_set_script_translations()` via `editor_script_handles`.
- Tightened the Post Lists Tab AJAX query: `no_found_rows` to skip the
  unneeded pagination count, and `update_post_thumbnail_cache()` to prime the
  thumbnail cache in one query rather than one per post.
- Pinned Composer's dependency-resolution platform to PHP 8.0, matching the
  plugin's floor, so package resolution in CI doesn't drift to a PHP
  8.1-only dependency version.

### Fixed

- Category Post's tab switching used to query and hide tab panels
  `document`-wide, so clicking a tab on one block affected every Category Post
  block on the page; scoped to each block instance.
- Several other server-side-rendering and data-storage bugs found during a
  block-by-block audit (empty blocks from a memoised save component, truncated
  `post_content` from over-large stored post data, an attribute type mismatch
  losing the active tab on reload) - see `wiki/Known-Issues-And-Fixes.md` for
  the full write-up of each.
- A WordPress core global (`$cat`) shadowed by a local variable in the Post
  Lists Tab render template.
- The Post Lists Tab AJAX handler didn't call `wp_reset_postdata()` after its
  loop, and named a local array `$post`, the same name `the_post()` had just
  set the global to two lines above; reset added, array renamed to `$card`.
- Several CI fixes: Subversion wasn't installed before the WordPress test
  suite step, the test suite installer's interactive database-recreate prompt
  hung the job with no stdin, and Composer's dependency resolution could
  drift onto a package version requiring a newer PHP than the plugin
  supports.

### Removed

- An abandoned movie/theatre-listings block variant (dead JS, unenqueued CSS,
  an unregistered REST route), a prior WooCommerce integration, and a custom
  post type/shortcode/WP-CLI experiment, none of which shipped in any block
  registered by this plugin.
- Dead tooling left over from the project's starter-kit origins: `.travis.yml`,
  a broken Gulp pipeline with dependencies that were never installed, and
  assorted unused npm packages.

[1.0.1]: https://github.com/anamwp/newsly/releases/tag/v1.0.1
[1.0.0]: https://github.com/anamwp/newsly/releases/tag/v1.0.0
