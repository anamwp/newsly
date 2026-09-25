# Newsly Plugin

[![CI](https://github.com/anamwp/newsly/actions/workflows/ci.yml/badge.svg)](https://github.com/anamwp/newsly/actions/workflows/ci.yml)

Newsly is a WordPress plugin that adds four Gutenberg blocks for surfacing news content on a site's own posts and categories — a category grid, a featured-content highlight, a "latest posts" list, and a tabbed post browser — for editors who want more layout control than core's block library gives them, without reaching for a page builder or an external feed. It doesn't call any external service; everything it renders comes from the site's own `wp_posts`/`wp_terms` tables.

## Architecture

### Block rendering: three static, one dynamic — not four dynamic blocks

The blocks are not uniform in how they render, and that distinction matters more than anything else in this codebase:

- **Post Lists Tab** is a genuinely dynamic block. Its `block.json` declares a `render` file (`render.php`), it ships no `save.js`, and WordPress calls `Class_Post_List_Tab_Callback`/`render.php` on every page load to turn the block's attributes into HTML. But "dynamic" here doesn't mean "re-queried on every view": the initial list of posts shown is whatever was fetched from the REST API in the editor and frozen into the block's attributes at save time (parsed straight out of the `<!-- wp:newsly-block/post-lists-tab {"fetchedPosts": [...]} -->` comment in `post_content`) — `render.php` re-renders that stored data server-side, it doesn't run a fresh `WP_Query`. The one place that *does* query live is category-tab switching: clicking a tab fires an `admin-ajax.php` request (`includes/Blocks/Inc/Class_Post_List_Tab_Callback.php`) that runs a bounded `WP_Query` (`posts_per_page => 9`) and returns freshly rendered HTML for that category.
- **Category Post, Featured Posts and Latest Posts** are ordinary static blocks: `index.js` registers both `edit` and `save`, `save.js` renders straight from the block's own attributes, and the result is serialised into `post_content` at publish time like any core block. Post/category data is fetched from the WordPress REST API (`apiFetch`) while editing, not at render time — so once a post is published, these three blocks show whatever was true when the block was last saved. Editing or deleting a referenced post afterwards won't be reflected until someone re-opens and re-saves the block. There's no PHP render callback, no query, and no caching involved in serving them — they're static HTML, so this is a staleness trade-off, not a query-cost one.

"Server-side rendered" applies to Post Lists Tab only, and even its *initial* content is attribute data captured at save time rather than a live query — only its AJAX tab-switch queries live.

### Registration

All four blocks are registered from one place, `Blocks\Block::register_block()` (`includes/Blocks/Block.php`), hooked on WordPress's `init` action. Each call is `register_block_type_from_metadata( NEWSLY_PATH . '/build/blocks/<name>' )`, reading the compiled `block.json` from `build/` — there's no per-block PHP registration to keep in sync. `Blocks\Inc\Class_Post_List_Tab_Callback` is a second, independent class registering the AJAX endpoints Post Lists Tab needs; both classes are instantiated from `Init.php`, which in turn is instantiated once from the main `Newsly` class's `plugins_loaded` hook.

### Query cost

The only PHP-side query this plugin runs against a page view is Post Lists Tab's AJAX tab switch: a `WP_Query` bounded to 9 posts (`posts_per_page => 9`), with `no_found_rows` set since the handler never paginates. `cache_results` isn't disabled anywhere in the plugin, so WordPress's own `WP_Query` result cache applies — since 6.1, `WP_Query` caches its results in the object cache, keyed with `last_changed` salts that invalidate automatically when posts or terms change. With a persistent object cache (Redis, Memcached, and so on) present, repeated identical tab switches don't re-hit the database; without one, WordPress's default object cache is per-request only, so each tab click still queries fresh. Featured image thumbnails are primed in a single `update_post_thumbnail_cache()` call rather than one query per post. The other three blocks impose no page-render query cost at all, for the staleness reasons above.

### Build pipeline

Blocks are built with `@wordpress/scripts` (webpack under the hood): `npm run build` compiles each `src/blocks/<name>` into `build/blocks/<name>`, which is what `Block.php` registers from. `build/` is git-ignored and only produced by running the build, so `src/` stays the single source of truth rather than committing generated output.

The WP Engine deploy workflows (`.github/workflows/main.yml`/`dev.yml`) run `npm ci && npm run build` and `composer install --no-dev` before deploying, so `build/` and `vendor/` (also git-ignored, also required at runtime for the Composer autoloader) exist on the target. Tagged releases (`.github/workflows/release.yml`) do the same and package the result into a zip for the [Releases page](https://github.com/anamwp/newsly/releases). If the plugin is ever active without `build/` present — installing straight from a repository tarball with no build step run, for instance — `Block::register_block()` detects it and shows an admin notice instead of the blocks silently not appearing.

Separately, `dist/css/main.css` is a small, hand-maintained Tailwind build (`npm run build-scss`, via `postcss.config.js`) that *is* committed to the repo and is enqueued globally by `newsly_enqueue_block_assets()`. Most of the utility classes used in `render.php` and the block markup (`grid`, `shadow-md`, `capitalize`, and so on) come from this Tailwind bundle rather than from each block's own webpack-bundled `style.scss`.

### Internationalisation

Text domain is `newsly` throughout (verified against every `__()`/`_e()`/`esc_html__()` call in PHP and every `@wordpress/i18n` call in `src/`). The plugin header declares `Domain Path: /languages` — a directory hint for translation tooling and for `load_plugin_textdomain()`'s default path, which this plugin doesn't call. PHP strings load via WordPress's just-in-time translation loading, which reads from `WP_LANG_DIR/plugins/` (where translate.wordpress.org language packs install) independently of `Domain Path`. JS strings load from the plugin's own `languages/` directory because `wp_set_script_translations()` is given that path explicitly.

`languages/newsly.pot` is generated with WP-CLI (`npm run i18n:pot`, wrapping `wp i18n make-pot`) rather than a Babel plugin, so one pass covers PHP strings, JS strings, and translatable `block.json` fields together. `npm run i18n:json` (`wp i18n make-json`) converts any `.po` files in `languages/` into the per-script JSON files WordPress's JS translation loading needs; `npm run i18n` runs both. For the JS side, `Block::register_block()` calls `wp_set_script_translations()` against each block's real editor script handle (read from the `WP_Block_Type` that `register_block_type_from_metadata()` returns, rather than a guessed handle name).

No translations ship with the plugin yet: `languages/` holds only the `.pot` template, and `npm run i18n:json` has nothing to convert until a `.po` file exists for some locale.

## Blocks

- **Category Post** — posts filtered by one or more categories, tabbed by category, with a configurable column layout.
- **Featured Posts** — a highlighted card layout for featured content from a category.
- **Latest Posts** — the most recent posts, with category filtering and a "show N" limit.
- **Post Lists Tab** — a tabbed post browser with AJAX-driven category switching (see Architecture above).

See [Blocks Overview](../../wiki/Blocks-Overview) for attributes and shared components.

## Installing

To use the plugin on a site, install the zip from the [Releases page](https://github.com/anamwp/newsly/releases) via Plugins → Add New → Upload Plugin. GitHub's own "Download ZIP" of the repository won't work: it contains `src/` but not the compiled `build/` or `vendor/`, so no blocks would register.

### Installing from source

```
git clone git@github.com:anamwp/newsly.git
cd newsly
composer install
npm ci
npm run build
```

This produces `build/` and `vendor/`, both required at runtime and neither tracked in git.

## Development

```
composer install
npm install
```

Node version is pinned in `.nvmrc` — run `nvm use` first if your global Node differs.

| Command | Purpose |
|---|---|
| `npm run build` | Production build of the blocks (`build/`) |
| `npm run start` | Watch mode: blocks plus the legacy `assets/` SCSS |
| `npm run build-scss` | Rebuild `dist/css/main.css` from `assets/scss` |
| `npm run i18n` | Regenerate `languages/newsly.pot` and convert any `.po` files to JSON (requires WP-CLI) |
| `composer lint:php` | PHPCS against the plugin's PHP |
| `composer lint:fix` | Auto-fix what PHPCBF can |
| `npm run lint:js` | ESLint against `src/` (see note below) |
| `npm run jest` | Jest unit tests (242 tests) |
| `vendor/bin/phpunit` | PHPUnit — currently a single placeholder test confirming the WP test harness is wired up correctly, not feature coverage (see `tests/README.md`) |
| `npx playwright test` | End-to-end tests against a live WordPress install (needs `WP_BASE_URL`, see `.env.example`) |

CI (`.github/workflows/ci.yml`) runs the PHP and JS commands above on every push to `main`/`dev` and on pull requests; Playwright runs as a separate, non-blocking job since it needs a live site the workflow doesn't provision.

`npm run lint:js` reports findings across `src/` (mostly formatting). It runs in CI as a non-blocking signal, not a gate — run it locally before relying on it for anything stricter.

## Requirements

- PHP 8.0+
- WordPress 6.0+
- Node version pinned in `.nvmrc`

## Licence

GPLv2 or later — see [LICENSE](LICENSE).

## Contributing

Run `composer lint:php` and `npm run jest` before opening a pull request; both run in CI. See [Development Workflow](../../wiki/Development-Workflow) for the day-to-day commands and the block-audit process used when touching an existing block, and [Known Issues & Fixes](../../wiki/Known-Issues-And-Fixes) before editing `save.js`, `view.js`, or the shared post-card components — several non-obvious bugs have been fixed there before.
