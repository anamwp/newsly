/**
 * E2E tests for the Latest Posts block.
 *
 * Follows the pattern established in block-test-category-post.spec.js and
 * the rewritten block-test-featured-posts.spec.js: real `expect()`
 * assertions throughout, no soft `if (isVisible) {console.log}` checks.
 *
 * Two things specific to this block worth calling out:
 *
 * 1. The block inserter search for "Latest Posts" returns **two** results -
 *    WordPress core's native Latest Posts block, and this plugin's
 *    `newsly-block/latest-posts`. Their accessible names only differ by a
 *    leading space (the custom block's icon glyph), so `insertLatestPostsBlock`
 *    below matches on the exact string ` Latest Posts` (leading space) to
 *    avoid inserting the wrong block. Confirmed live: searching "Latest
 *    Posts" in the inserter lists both `option "Latest Posts"` (core) and
 *    `option " Latest Posts"` (this plugin's, with an icon).
 *
 * 2. Every post card renders as one giant `<a href>` (see
 *    GSPostCardOverlay.js, shared with featured-posts). Clicking it inside
 *    the block editor follows the link and navigates the whole editor
 *    iframe away to the post's live frontend page - see
 *    tests/e2e/featured-posts-e2e-audit.md, FPE2E-05. This spec avoids that
 *    entirely by selecting the block via the "Document Overview" list view
 *    instead of clicking card content directly.
 */

const { test, expect } = require('@playwright/test');
require('dotenv').config();

const WP_ADMIN_USERNAME = process.env.WP_ADMIN_USERNAME || 'admin';
const WP_ADMIN_PASSWORD = process.env.WP_ADMIN_PASSWORD || 'password';

// Category assumed present in the site's seeded demo content, with
// multiple posts. Also relied on by the other block-test-*.spec.js files.
const CATEGORY = 'ancient';

const PAGE_TITLE = 'Latest Posts E2E Test Page';

/**
 * Logs into wp-admin if not already authenticated, and asserts success.
 * @param {import('@playwright/test').Page} page
 */
async function login(page) {
	await page.goto('/wp-admin');

	if (page.url().includes('wp-login')) {
		await page.fill('#user_login', WP_ADMIN_USERNAME);
		await page.fill('#user_pass', WP_ADMIN_PASSWORD);
		await page.click('#wp-submit');
	}

	await expect(page.locator('#wpadminbar')).toBeVisible({ timeout: 15000 });
}

/**
 * Opens the block inserter and inserts this plugin's Latest Posts block -
 * not WordPress core's native block of the same name (see file header).
 * Assumes the inserted block becomes selected, so the Inspector sidebar
 * afterwards refers to this block.
 *
 * Both blocks render an *identical* accessible name ("Latest Posts", no
 * distinguishing text or aria-label - confirmed by inspecting the raw DOM,
 * not just the accessibility tree), so `getByRole('option', { name })`
 * cannot disambiguate them no matter how it's tuned. The only reliable
 * difference is each option's CSS class:
 * `editor-block-list-item-newsly-block-latest-posts` (this plugin) vs.
 * `editor-block-list-item-latest-posts` (WordPress core).
 * @param {import('@playwright/test').Page} page
 */
async function insertLatestPostsBlock(page) {
	const toggle = page.getByRole('button', {
		name: 'Block Inserter',
		exact: true,
	});
	const isOpen = (await toggle.getAttribute('aria-expanded')) === 'true';
	if (!isOpen) {
		await toggle.click();
	}

	const searchInput = page.getByRole('searchbox', { name: 'Search' });
	await expect(searchInput).toBeVisible({ timeout: 10000 });
	await searchInput.fill('Latest Posts');

	const option = page.locator(
		'.editor-block-list-item-newsly-block-latest-posts'
	);
	await expect(option).toBeVisible({ timeout: 10000 });
	await option.click();
}

/**
 * Selects a category in the currently-selected Latest Posts block's
 * "Choose Category" sidebar select control.
 * @param {import('@playwright/test').Page} page
 * @param {string} categoryName
 */
async function selectCategory(page, categoryName) {
	const select = page.getByLabel('Choose Category');
	await expect(select).toBeVisible({ timeout: 10000 });
	await select.selectOption({ label: categoryName });
}

/**
 * Selects the Latest Posts block via the "Document Overview" list view
 * instead of clicking its rendered content directly (see file header).
 * @param {import('@playwright/test').Page} page
 */
async function selectLatestPostsBlockViaListView(page) {
	await page.getByRole('button', { name: 'Document Overview' }).click();
	await page.getByRole('link', { name: /Latest Posts/ }).click();
}

/**
 * Returns the `aria-label` ("Read more about <title>") of every post card
 * link currently rendered within `scope`, in DOM order. Used to compare
 * which posts are shown before/after a control change without depending
 * on a dedicated title CSS class (GSPostCardOverlay.js has none).
 * @param {import('@playwright/test').Locator} scope
 * @returns {Promise<string[]>}
 */
async function getCardAriaLabels(scope) {
	return scope
		.locator('a.overlay-wrapper-as-link')
		.evaluateAll((links) => links.map((el) => el.getAttribute('aria-label')));
}

test.describe.serial('Latest Posts block', () => {
	let pageId;
	let pageUrl;

	test.beforeEach(async ({ page }) => {
		await login(page);
	});

	test.afterAll(async ({ browser }) => {
		if (!pageId) {
			return;
		}

		// The pages list row's "Trash" link carries a valid `_wpnonce`;
		// `action=trash` without one is silently ignored by WordPress
		// instead of actually trashing the post.
		const page = await browser.newPage();
		await login(page);
		await page.goto(
			`/wp-admin/edit.php?post_type=page&s=${encodeURIComponent(
				PAGE_TITLE
			)}`
		);
		const row = page
			.locator('tr')
			.filter({ has: page.locator(`a[href*="post=${pageId}&action=edit"]`) });
		const trashLink = row.getByRole('link', { name: /to the Trash/i });
		const trashHref = await trashLink.getAttribute('href').catch(() => null);
		if (trashHref) {
			await page.goto(trashHref);
		}
		await page.close();
	});

	test('creates a page with a Latest Posts block, exercises the Ignore Sticky Posts and Show Category toggles, and publishes it', async ({
		page,
	}) => {
		await page.goto('/wp-admin/post-new.php?post_type=page');

		const editorFrame = page.frameLocator('iframe[name="editor-canvas"]');
		await expect(
			editorFrame.getByRole('textbox', { name: 'Add title' })
		).toBeVisible({ timeout: 15000 });
		await editorFrame
			.getByRole('textbox', { name: 'Add title' })
			.fill(PAGE_TITLE);

		await insertLatestPostsBlock(page);

		const block = editorFrame.locator('.newsly_block__latest_posts');
		const firstCard = block.locator('.newsly__post_card__overlay').first();
		await expect(firstCard).toBeVisible({ timeout: 10000 });

		// Default view (no category, sticky posts included).
		const labelsWithSticky = await getCardAriaLabels(block);
		expect(labelsWithSticky.length).toBeGreaterThan(0);

		// "Ignore Sticky Posts" should change which posts are fetched -
		// live-verified: the sticky post pinned at the top of the default
		// listing drops out once this is checked.
		await page
			.getByRole('checkbox', { name: 'Ignore Sticky Posts' })
			.setChecked(true);
		await expect(firstCard).toBeVisible({ timeout: 10000 });
		await expect
			.poll(() => getCardAriaLabels(block), { timeout: 10000 })
			.not.toEqual(labelsWithSticky);

		// Selecting a category re-fetches and filters the list.
		await selectCategory(page, CATEGORY);
		await expect(firstCard).toBeVisible({ timeout: 10000 });
		const categoryBadge = firstCard.locator('.categories .single-category');
		await expect(categoryBadge.first()).toBeVisible();

		// "Show Category" - verify both directions reach the editor render.
		await page.getByRole('checkbox', { name: 'Show Category' }).setChecked(
			false
		);
		await expect(categoryBadge).toHaveCount(0);

		await page.getByRole('checkbox', { name: 'Show Category' }).setChecked(
			true
		);
		await expect(categoryBadge.first()).toBeVisible();

		// Close the block inserter search popover in case it's still open,
		// so it can't intercept the publish flow's own buttons.
		await page.keyboard.press('Escape');

		await page.getByRole('button', { name: 'Publish', exact: true }).click();
		await page
			.getByLabel('Editor publish')
			.getByRole('button', { name: 'Publish', exact: true })
			.click();

		await page.waitForURL(/[?&]post=\d+/, { timeout: 20000 });

		const currentUrl = page.url();
		const postIdMatch = currentUrl.match(/post=(\d+)/);
		expect(postIdMatch).not.toBeNull();
		pageId = postIdMatch[1];
		pageUrl = `/?page_id=${pageId}`;
	});

	test('renders the block correctly on the frontend after publish', async ({
		page,
	}) => {
		expect(pageUrl).toBeTruthy();
		await page.goto(pageUrl);

		const block = page.locator('.newsly_block__latest_posts');
		await expect(block).toBeVisible();

		const cards = block.locator('.newsly__post_card__overlay');
		const cardCount = await cards.count();
		// Bounded by numberOfPosts (default 4); exact count depends on how
		// many posts the fixture category has, so just assert it's sane.
		expect(cardCount).toBeGreaterThan(0);
		expect(cardCount).toBeLessThanOrEqual(4);

		const firstCard = cards.first();

		const link = firstCard.locator('a.overlay-wrapper-as-link');
		await expect(link).toBeVisible();
		await expect(link).toHaveAttribute('aria-label', /^Read more about /);

		await expect(firstCard).toContainText(/.+/); // title text is present

		const hasImage = await firstCard.locator('.featured-image img').count();
		const hasNoImageMessage = await firstCard
			.locator('.no-featured-image')
			.count();
		expect(hasImage + hasNoImageMessage).toBeGreaterThan(0);

		// Show Category was left on before publish - the badge should be
		// present on the frontend too.
		await expect(
			firstCard.locator('.categories .single-category').first()
		).toBeVisible();
	});

	test('first post link on the frontend is reachable via keyboard Tab navigation', async ({
		page,
	}) => {
		expect(pageUrl).toBeTruthy();
		await page.goto(pageUrl);

		const firstLink = page
			.locator('.newsly_block__latest_posts .newsly__post_card__overlay')
			.first()
			.locator('a.overlay-wrapper-as-link');
		await expect(firstLink).toBeVisible();

		await page.locator('body').focus();

		const MAX_TAB_PRESSES = 30;
		let reached = false;
		for (let i = 0; i < MAX_TAB_PRESSES && !reached; i++) {
			await page.keyboard.press('Tab');
			reached = await firstLink.evaluate(
				(el) => document.activeElement === el
			);
		}

		expect(reached).toBe(true);
		await expect(firstLink).toBeFocused();
	});

	test.fixme(
		'the sidebar panel is titled "Latest Posts Controls", not a copy-pasted "Featured Posts Controls"',
		async ({ page }) => {
			expect(pageId).toBeTruthy();
			await page.goto(`/wp-admin/post.php?post=${pageId}&action=edit`);

			await selectLatestPostsBlockViaListView(page);

			await expect(
				page.getByRole('button', { name: 'Latest Posts Controls' })
			).toBeVisible({ timeout: 15000 });
		}
	);
});
