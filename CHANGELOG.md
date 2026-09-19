# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-19

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
- A GitHub Actions CI workflow running PHPCS, PHPUnit, Jest and Playwright on
  every push to `main`/`dev` and on pull requests.
- `LICENSE` (GPLv2) and this changelog.

### Changed

- Reworked `.phpcs.xml.dist` into a working ruleset: correct prefixes and text
  domain, a PHP 8.0+ compatibility target, and `minimum_supported_wp_version`
  matching `readme.txt`. Added `composer lint:php`/`lint:fix` scripts.
- Brought the plugin header, `readme.txt`, `package.json` and `composer.json`
  version numbers in line with each other.

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

### Removed

- An abandoned movie/theatre-listings block variant (dead JS, unenqueued CSS,
  an unregistered REST route), a prior WooCommerce integration, and a custom
  post type/shortcode/WP-CLI experiment, none of which shipped in any block
  registered by this plugin.
- Dead tooling left over from the project's starter-kit origins: `.travis.yml`,
  a broken Gulp pipeline with dependencies that were never installed, and
  assorted unused npm packages.

[1.0.0]: https://github.com/anamwp/newsly/releases/tag/v1.0.0
