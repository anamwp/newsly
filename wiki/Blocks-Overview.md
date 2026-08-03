# Blocks Overview

All blocks live under `src/blocks/<block-name>/`, are registered dynamically (server-side render via PHP in `includes/Blocks/Block.php`), and share components from `src/blocks/components/`.

## Category Post

`src/blocks/category-post/` — `newsly-block/category-post`

Displays posts filtered by one or more selected categories, rendered as a tabbed grid (one tab per category). Key attributes: `categories`, `selectedCategroyId`, `postsToShow`, `postColumn`, `activeTab`.

- A native `<select multiple>` category picker is capped at 10 selections (`MAX_SELECTABLE_CATEGORIES` in `edit.js`) to avoid triggering a very large per-post payload.
- Frontend tab switching is powered by `view.js` and is scoped per block instance (multiple Category Post blocks can coexist on one page).
- See [Known Issues & Fixes](Known-Issues-And-Fixes) for the history of production bugs found in this block — it has the deepest audit trail of the five.

## Featured Posts

`src/blocks/featured-posts/` — `newsly-block/featured-posts`

Showcases posts from a single selected category in a highlighted card layout, using the shared `GSPostCardOverlay` component. Key attributes: `categories`, `selectedCategroyId`, `fetchedPosts`, `numberOfPosts`.

## Latest Posts

`src/blocks/latest-posts/` — `newsly-block/latest-posts`

Structurally near-identical to Featured Posts, plus a "sticky posts" option and pagination-style controls. Shares `GSPostCardOverlay` with Featured Posts, so a fix to that component affects both blocks.

## Post Lists Tab

`src/blocks/post-lists-tab/` — `newsly-block/post-lists-tab`

Tabbed interface for browsing multiple post lists with dynamic switching between them.

## Smart Category Posts

`src/blocks/smart-category-posts/` — `anam-gutenberg-starter-block/smart-category-posts`

Category-based post display with its own local `components.js`/`getFeaturedImage.js` (not shared with the other blocks). Historically the least mature of the five blocks — see its audit history in [Known Issues & Fixes](Known-Issues-And-Fixes).

## Shared components (`src/blocks/components/`)

- `GSPostCard.js` / `GSPostCardOverlay.js` — the shared post-card renderers used by `category-post`, `featured-posts`, and `latest-posts`. **Never wrap either in `React.memo()`** — see [Known Issues & Fixes](Known-Issues-And-Fixes) for why.
- A number of files in this folder are dead code (unused anywhere in the plugin, verified via grep): `HandleMovieUpdate.js`, `MovieCard.js`, `PopupModal.js`, `HandleModal.js`, `FetchMovie.js`, `WooCommerceAPI.js`, `TestComponents.js`, and a few others. Several of these are legacy leftovers from an earlier movie-catalog/WooCommerce prototype and are safe to delete when doing bundle cleanup — check with `grep -r` for any import before removing one.

### Creating a new block

```
npx @wordpress/create-block@latest your-block-name --variant=dynamic --no-plugin
```

See [Development Workflow](Development-Workflow) for the full process, including the block-audit checklist applied to each block above.
