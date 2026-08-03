# Known Issues & Fixes

A running log of real bugs found (and fixed) while auditing the plugin's blocks. Several of these are subtle enough to reintroduce by accident — read the "critical" ones before touching `save.js`, `view.js`, or shared components in `src/blocks/components/`.

## Critical — never wrap a component reachable from `save.js` in `React.memo()`

`@wordpress/element`'s `renderToString()` — the mechanism block serialization uses to build the static HTML persisted into `post_content` — silently returns an **empty string** for any `React.memo`-wrapped component. No error, no console warning. It renders perfectly fine in the live editor (a different, client-side React render path), so the bug is invisible during normal editing.

Verified directly: `wp.element.renderToString(createElement(React.memo(Component)))` → `""`.

This exact mistake — memoizing `GSPostCard.js`/`GSPostCardOverlay.js` as a re-render-optimization fix — caused `featured-posts`, `latest-posts`, and `category-post` to **publish completely empty blocks on the frontend** for an unknown period. It went undetected partly because the `featured-posts` e2e spec had zero `expect()` assertions (see [Testing Guide](Testing-Guide)), and partly because this repo's project-wide Jest mock at `__mocks__/@wordpress/element.js` strips out `createElement`/`renderToString` for every test — the entire unit test layer structurally can't see this class of bug by default.

**Fix pattern**: removed `React.memo()` from both shared components. If a save-shared component genuinely needs render-cost optimization, memoize only inside `edit.js`'s own list rendering — never the shared component itself, and never anything `save.js` imports. The regression test pattern (`category-post/save.ssr-regression.test.js`) uses `jest.requireActual('@wordpress/element')` to bypass the mock and assert real, non-empty SSR output.

## Critical — never store raw `_embed`'d REST API post objects directly in block attributes

`category-post` used to store the full `/wp/v2/posts?...&_embed` response (every registered image size for the featured media, full taxonomy term objects with `_links`/`meta`/`description`, etc.) in `allCategoryPosts`/`fetchedPosts`. None of that is used by `GSPostCard` — it only reads `_embedded['wp:featuredmedia'][0].source_url`/`.alt_text` and each term's `name`/`link`.

With multiple categories selected × up to 24 posts each, this routinely produced 500KB+ of JSON embedded in one block's HTML comment in `post_content`, which got **truncated somewhere in the save pipeline** (confirmed via "Edit as HTML" — no closing `-->` for the block comment was even present), causing Gutenberg's "Attempt Block Recovery" prompt on reload.

**Fix**: a `slimPostForStorage()` helper in `category-post/edit.js` trims each post to only the fields actually rendered before it's ever passed to `setAttributes` (~75% size reduction on a representative post). `featured-posts` and `latest-posts` store raw `fetchedPosts` the same way and likely carry the same latent risk (without category-post's multi-category multiplier) — worth the same fix proactively.

Related, smaller-scale version of the same root cause: shift-click range-selecting `category-post`'s category `<select multiple>` can select dozens of categories in one action (native browser behavior), re-triggering this at scale even with per-post trimming. Fixed with a hard cap, `MAX_SELECTABLE_CATEGORIES = 10`, plus a loading indicator while the resulting parallel fetches are in flight.

## Critical — a `setAttributes()` value's JS type must match its declared `block.json` type

WordPress validates every comment (non-sourced) attribute against its schema type when re-parsing a block; a type mismatch gets **silently replaced with the declared default** instead of erroring — no warning anywhere.

`category-post`'s `activeTab` is declared `"type": "number"` in `block.json`, but the code stored the raw string straight from a `<select multiple>` control (`selectedCatIds[0]`). The tell: the block-validation console diff showed everything byte-identical except the active-tab state — because `activeTab` came back `null` after reload while an unrelated derived DOM attribute (with its own `||` fallback) still looked right.

**Fix**: `Number(selectedCatIds[0])` instead of the raw string. **Any attribute set from a raw HTML control value (`<select>`, text input, etc.) and declared `"number"` or `"boolean"` in `block.json` is at risk of this** — check every `setAttributes()` call against its declared type, not just this one spot.

## Critical — frontend `view.js` DOM queries must be scoped per block instance, never `document`-wide

`category-post/view.js` (the `viewScript` powering frontend tab clicks) used to query `document.querySelectorAll(...)` globally, and on any tab click hid *every* tab panel on the page via another `document`-wide query. With two or more `category-post` blocks on the same page, clicking a tab in one block hid the other block's active panel too.

**Fix**: scope every query to the specific `.newsly__category_post` container (`block.querySelectorAll(...)`/`block.querySelector(...)`) instead of `document`-wide. **Any block that ships a `viewScript` and can legally appear more than once on a page needs this same check.**

## High — N+1 fetch waterfalls

Category names and featured images were fetched **once per rendered post card** independently, instead of batched once per block render:

- `RenderPostCategoryData` (existed nearly identically in three places: `components/RenderPostCategoryData.js`, `post-lists-tab/components.js`, `smart-category-posts/components.js`) called `apiFetch({ path: '/wp/v2/categories?include=...' })` per post row.
- `getFeaturedImage.js` variants called `useSelect(() => getEntityRecords('postType', 'attachment', { include: [postId] }))` per post row instead of one batched `include=[id1,id2,...]` call.

`smart-category-posts` specifically: the parent block already fetches the entire category list once on mount into `attributes.categories` — the per-post fetch was pure redundant waterfall. **Fix**: pass `attributes.categories` down and do a local `.filter()` lookup instead of a REST call. Check whether any new block's "per-item" fetch duplicates data the parent already has before assuming it needs a bigger batching refactor.

## High — hardcoded secrets in dead code (resolved by deletion)

`components/FetchMovie.js` used to hardcode a JWT bearer token directly in source; `components/WooCommerceAPI.js` passed a `consumerKey`/`consumerSecret` straight into a client-importable module. Both were unused dead code (unreferenced by any registered block) left over from an earlier movie-catalog/WooCommerce prototype, but would have shipped the secret in the public JS bundle if ever wired up. **Both files (along with `APIResponsePromise.js`, `HandleModal.js`, `HandleMovieUpdate.js`, `MovieCard.js`, `PopupModal.js`, `TestComponents.js`) have since been deleted** as part of a `src/blocks/components/` cleanup — if similar prototype/demo code shows up again, prefer deleting over leaving it dormant.

## Medium-High — no dedup/cancellation on category/post fetches

Every block's category/post fetch used raw `apiFetch(...).then(setAttributes)` inside `useEffect` with no `AbortController` and no request dedup — rapidly switching categories could let a stale response resolve after a newer one and overwrite fresher state. **Fix pattern (applied to all blocks)**: a `useRef` request-id counter; each fetch call captures its own id, and the `.then()` callback bails out if a newer request has since started.

## Medium — re-render optimization patterns

- Components (`FallbackMessage`, `PostCard`, `HandleColorPanel`) declared **inside** `edit()`'s function body — React sees a new component type every render, forcing full remount instead of a diff. Fix: hoist to module scope. (Two `PostCard` copies were also fully dead code — the actual list rendering reimplemented the same markup inline.)
- List-rendered cards (`GSPostCard`, `GSPostCardOverlay`) not originally memoized, causing unrelated sidebar toggles to rebuild every card's JSX tree. **Caution**: memoization must live in `edit.js`'s own list rendering only — never on the shared component itself (see the `React.memo`/SSR bug above).
- `useEffect` dependent on a whole array reference (`attributes.categories`) instead of a primitive (`attributes.categories.length`) when the effect body only cares whether the array is empty.
- Derived state (`activeTab`/`fetchedPosts`) computed reactively in a `useEffect` instead of directly in the triggering handler — moved into `handleCategoryChange`/`handleTabClick`, dropping the effect entirely.

## Medium — JS performance

O(n×m) `.find()` lookups inside `.map()` loops (e.g. category lookup in `category-post/edit.js`) — fixed by building a `Map` keyed by id once per call, then doing O(1) `.get()` lookups.

## Test-suite gotchas found along the way

- **`jest.clearAllMocks()` in `beforeEach` does not clear queued `mockResolvedValueOnce`/`mockRejectedValueOnce` values or a custom `mockImplementation`.** An over-queued or under-consumed mock in one test can leak into the next test's assertions. Found a real instance in `latest-posts/edit.test.js` (a test queued 3 resolved values but the component only consumed 2). Guard with an explicit `apiFetch.mockReset()` in tests that are sensitive to this.
- **Soft-checked e2e specs (`if (isVisible) console.log else ⚠️`, no `expect()`) can pass while the feature is completely broken** — this is exactly how the `React.memo` SSR bug shipped undetected. Always assert on real DOM state.
- When a reported symptom can't be reproduced with small, hand-written test fixtures, ask for the **actual stored artifact** ("Edit as HTML" on the broken block, the browser's block-validation console diff) before concluding it's environmental — both the payload-truncation bug and the `activeTab` type-mismatch bug above only manifested at real data scale / in a real re-parse diff, not in synthetic fixtures.

## Open / known product bugs (not yet fixed)

From the `featured-posts` e2e audit:

- **"Show Featured Image" and "Show Excerpt" sidebar toggles in `GSPostCardOverlay.js` are non-functional** — the image renders unconditionally based on whether the post has one, and there's no excerpt-rendering branch at all. Regression tests already exist as `test.fixme()` in `tests/e2e/block-test-featured-posts.spec.js` — flip to `test()` once the underlying component is fixed.
- **Post cards inside the block editor are fully-navigable `<a href>` links with no click-guard** — clicking anywhere on a card in the editor follows the link and navigates the whole editor iframe away, losing unsaved changes. Needs an editor-context flag or `onClick`/`preventDefault` guard scoped to the editor in `GSPostCardOverlay.js`/`GSPostCard.js`.
- e2e specs generally depend on ambient pre-existing categories/posts in the WP install rather than deterministic REST-created fixtures with teardown.

## Miscellaneous cleanup notes

- `smart-category-posts` was the messiest of the audited blocks: a literal `debugger;` statement, ~50 lines of a dead component never rendered, a sidebar toggle wired to a commented-out render branch (silently non-functional), and state seeded from an attribute name that doesn't exist in `block.json` (typo'd vs. the real one). All fixed.
- `post-lists-tab/view.js` and `smart-category-posts/view.js` are zero-byte files still registered as `viewScript` in their `block.json` — left in place; removing them could affect build entry resolution and hasn't been investigated.
- `src/blocks/components/` still has a few files worth checking for use before touching: `EditorImageUploader.js`, `GSPaddingControl.js`, `TabPanelForTextAndLink.js`, `TypographyControl.js`, `WrapPromise.js` were flagged as unreferenced in the original repo-wide audit — verify with `grep -r` before assuming they're still dead, since the component set has changed since that audit.
