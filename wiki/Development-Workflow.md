# Development Workflow

## Setup

```
composer install
npm install        # or: yarn install
```

## Day-to-day commands

| Command | Purpose |
|---|---|
| `npm run start` | Watches blocks (`wp-scripts start`) and legacy `assets/` SCSS/JS together |
| `npm run block-dev` | Watches only the blocks build |
| `npm run build` | Production build (`wp-scripts build --experimental-modules`) |
| `npm run watch-assets` | Watches only `assets/scss` and `assets/js` (legacy, non-block assets) |
| `npm run packages-update` | Updates `@wordpress/*` packages via `wp scripts packages-update` |

Node version is pinned in `.nvmrc` (`v16.15.0`) — use `nvm use` before installing if your global Node differs.

## Creating a new block

```
npx @wordpress/create-block@latest example-name --variant=dynamic --no-plugin
```

The `--variant=dynamic` flag scaffolds a block with PHP server-side rendering (`render.php`) rather than a static `save.js` markup block. Every block in this plugin supports:

- Server-side rendering (SSR)
- Full block styling and customization
- Editor and frontend preview
- Internationalization

Blocks are registered from `includes/Blocks/Block.php`.

## Internationalization

```js
import { __ } from '@wordpress/i18n';
console.log( __( 'My log text here', 'newsly' ) );
```

Text domain is `newsly`. Regenerate `gettext.pot` after adding new translatable strings (check `package.json`/`composer.json` for the exact i18n build command in use, if one has been wired up).

## Block audit process

Every existing block (`category-post`, `featured-posts`, `latest-posts`, `smart-category-posts`; `post-lists-tab` remaining) has been audited against the Vercel React/Next.js performance best-practices ruleset, focused on the categories that actually apply to client-side Gutenberg/React (re-render optimization, JS performance, waterfalls — not Next.js/RSC-specific rules). Use this same process for any new block or when revisiting an old one:

1. **Audit** `edit.js` + `save.js` (and any shared component they import, e.g. `GSPostCard.js` / `GSPostCardOverlay.js`) against the ruleset.
2. **Present a findings table** (ID, Issue, Severity, Recommendation) *before making changes* — fix issues first, extend tests after.
3. **Apply the fixes.**
4. **Get coverage to 100%.** `npx jest src/blocks/<block> --coverage --collectCoverageFrom="src/blocks/<block>/edit.js" --collectCoverageFrom="src/blocks/<block>/save.js"`, then add tests until statements/branches/functions/lines are all 100% for both files.
5. **Run the full suite** (`npx jest`) to confirm no regressions — especially for shared components used by multiple blocks (`GSPostCard.js`, `GSPostCardOverlay.js`).
6. **Record findings** in this wiki's [Known Issues & Fixes](Known-Issues-And-Fixes) page (id, issue, severity, how it was solved) rather than a new file in the repo.

### Recurring patterns worth checking on any block pass

- `useEffect` depending on a whole array reference (e.g. `attributes.categories`) instead of a primitive like `.length`.
- Inline components (e.g. `FallbackMessage`, `PostCard`) defined inside `edit()` — recreated every render instead of hoisted to module scope.
- Debug `console.log`/`debugger` statements left in shipped code.
- No stale-response guard on category/post fetch handlers — fix with a `useRef` request-id counter so an old in-flight request can't overwrite state set by a newer one.
- A local per-item fetch that's redundant with data the parent block already loaded once (check before assuming it needs a bigger batching refactor).
- Raw, fully `_embed`'d REST API objects stored directly in block attributes — trims to only the fields actually rendered before `setAttributes` (see `slimPostForStorage()` in `category-post/edit.js` for the pattern).
- A `setAttributes()` value whose JS type doesn't match its `block.json` declared `type` (WordPress silently discards mismatched attributes on reload instead of erroring).
- `view.js` (frontend interactivity scripts) querying `document` globally instead of scoping to the specific block instance — breaks when two instances of the same block share a page.

Full details and the specific bugs each of these caused in production are in [Known Issues & Fixes](Known-Issues-And-Fixes).
