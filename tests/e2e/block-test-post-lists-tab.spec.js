/**
 * E2E tests for the Post Lists Tab block.
 *
 * Follows the pattern established in block-test-category-post.spec.js and
 * block-test-latest-posts.spec.js: real `expect()` assertions throughout.
 *
 * A few things specific to this block worth calling out:
 *
 * 1. Unlike Category Post / Featured Posts / Latest Posts, this block has no
 *    "choose category" sidebar control. `edit.js` auto-populates
 *    `attributes.categories` with *every* site category on mount, so every
 *    instance of the block ends up with the same set of tabs - there's
 *    nothing to select per-instance.
 *
 * 2. The category tabs rendered in the block editor preview
 *    (`<nav className="tab ...">` in edit.js) are plain `<a>` elements with
 *    no `onClick` handler at all. Clicking a tab does nothing in the editor
 *    - tab switching only exists on the published frontend, wired up by
 *    view.js against the PHP-rendered `<button class="tablinks">` markup
 *    (see render.php / Class_Post_List_Tab_Callback.php). So editor tests
 *    below only assert the toggle controls; tab-click behavior is only
 *    testable after publish.
 *
 * 3. In the editor, the post title renders as a bare `<h2>` (no anchor -
 *    see edit.js's post-lists map), and the category links rendered by
 *    components.js (RenderPostCategoryData) sit inside a wrapping `<div>`
 *    that carries no CSS class at all - so the "Show Category" toggle is
 *    verified via `h2.post-card__title + div:not(.post-card__excerpt)`,
 *    i.e. "the unclassed div right after the title". Counting bare `<a>`
 *    tags doesn't work: a post's excerpt HTML from the REST API can itself
 *    contain a "Continued"/read-more link (confirmed live on this site's
 *    fixture content), which would be miscounted as a category link. The
 *    frontend's PHP-rendered card is different again: the title *is* a
 *    link (`a.post-card__title`) and category badges do carry a class
 *    (`a.post-card__category`).
 */

const { test, expect } = require('@playwright/test');
require('dotenv').config();

const WP_ADMIN_USERNAME = process.env.WP_ADMIN_USERNAME || 'admin';
const WP_ADMIN_PASSWORD = process.env.WP_ADMIN_PASSWORD || 'password';

// Category assumed present in the site's seeded demo content, with
// multiple posts. Also relied on by the other block-test-*.spec.js files.
const CATEGORY_SLUG = 'ancient';

const PAGE_TITLE = 'Post Lists Tab E2E Test Page';
const PAGE_TITLE_TWO_BLOCKS = 'Post Lists Tab Two Blocks E2E Test Page';

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
 * Opens the block inserter and inserts a Post Lists Tab block. Assumes the
 * inserted block becomes the selected block (default Gutenberg behavior),
 * so the Inspector sidebar afterwards refers to this block.
 * @param {import('@playwright/test').Page} page
 */
async function insertPostListsTabBlock(page) {
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
	await searchInput.fill('Post Lists Tab');

	const option = page.locator(
		'.editor-block-list-item-newsly-block-post-lists-tab'
	);
	await expect(option).toBeVisible({ timeout: 10000 });
	await option.click();
}

/**
 * Trashes a published page by title. The pages list row's "Trash" link
 * carries a valid `_wpnonce`; `action=trash` without one is silently
 * ignored by WordPress instead of actually trashing the post.
 * @param {import('@playwright/test').Browser} browser
 * @param {string} pageId
 * @param {string} title
 */
async function trashPage(browser, pageId, title) {
	if (!pageId) {
		return;
	}

	const page = await browser.newPage();
	await login(page);
	await page.goto(
		`/wp-admin/edit.php?post_type=page&s=${encodeURIComponent(title)}`
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
}

test.describe.serial('Post Lists Tab block', () => {
	let pageId;
	let pageUrl;

	test.beforeEach(async ({ page }) => {
		await login(page);
	});

	test.afterAll(async ({ browser }) => {
		await trashPage(browser, pageId, PAGE_TITLE);
	});

	test('creates a page with a Post Lists Tab block, exercises the Show Category, Show Excerpt and Show Featured Image toggles, and publishes it', async ({
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

		await insertPostListsTabBlock(page);

		const block = editorFrame.locator(
			'.wp-block-newsly-block-post-lists-tab'
		);
		const firstCard = block.locator('.post-card').first();
		await expect(firstCard).toBeVisible({ timeout: 10000 });

		// Categories are fetched async on mount - once loaded, more than
		// just the "All" tab should be rendered.
		await expect
			.poll(() => block.locator('.tablinks').count(), { timeout: 10000 })
			.toBeGreaterThan(1);

		// "Show Category" - the category wrapper div carries no class (see
		// file header), so it's targeted structurally: the unclassed div
		// immediately after the title, which is absent entirely when the
		// toggle is off (not just visually hidden).
		const categoryWrapper = firstCard.locator(
			'h2.post-card__title + div:not(.post-card__excerpt)'
		);
		await expect(categoryWrapper).toHaveCount(1);

		await page
			.getByRole('checkbox', { name: 'Show Category' })
			.setChecked(false);
		await expect(categoryWrapper).toHaveCount(0);

		await page
			.getByRole('checkbox', { name: 'Show Category' })
			.setChecked(true);
		await expect(categoryWrapper).toHaveCount(1);

		// "Show Excerpt".
		await expect(firstCard.locator('.post-card__excerpt')).toBeVisible();

		await page
			.getByRole('checkbox', { name: 'Show Excerpt' })
			.setChecked(false);
		await expect(firstCard.locator('.post-card__excerpt')).toHaveCount(0);

		await page
			.getByRole('checkbox', { name: 'Show Excerpt' })
			.setChecked(true);
		await expect(firstCard.locator('.post-card__excerpt')).toBeVisible();

		// "Show Featured Image" - only the "off" direction is deterministic
		// in the editor (whether any fetched post actually has a featured
		// image depends on fixture data), so only that direction is
		// asserted. It's left checked again afterwards so the frontend
		// test below (which relies on render.php's placeholder image
		// fallback) sees it enabled.
		await page
			.getByRole('checkbox', { name: 'Show Featured Image' })
			.setChecked(false);
		await expect(block.locator('.post-card img')).toHaveCount(0);

		await page
			.getByRole('checkbox', { name: 'Show Featured Image' })
			.setChecked(true);

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

		const block = page.locator('.post-lists-tab.newsly__post_list_tab');
		await expect(block).toBeVisible();
		await expect(block).toHaveAttribute('data-postid', pageId);

		// Default state: "All" tab active and selected.
		const allTab = block.locator('.tablinks[data-cat-slug=""]');
		await expect(allTab).toHaveClass(/active/);
		await expect(allTab).toHaveAttribute('aria-selected', 'true');

		// More than just "All" - the site's categories were baked into the
		// block's attributes at publish time.
		expect(await block.locator('.tablinks').count()).toBeGreaterThan(1);

		const cards = block.locator(
			'#post-list-tab-post-content .post-card'
		);
		const cardCount = await cards.count();
		expect(cardCount).toBeGreaterThan(0);

		const firstCard = cards.first();

		const titleLink = firstCard.locator('a.post-card__title');
		await expect(titleLink).toBeVisible();
		await expect(titleLink).toContainText(/.+/);

		// Show Featured Image was left on before publish - render.php always
		// renders an <img> when it's on, either the real thumbnail or a
		// placeholder fallback, so this is deterministic.
		await expect(firstCard.locator('img')).not.toHaveCount(0);

		// Show Category was left on before publish.
		await expect(
			firstCard.locator('a.post-card__category').first()
		).toBeVisible();

		// Show Excerpt was left on before publish.
		await expect(firstCard.locator('.post-card__excerpt')).toBeVisible();
	});

	test('clicking a category tab on the frontend re-fetches and filters the post list via AJAX', async ({
		page,
	}) => {
		expect(pageUrl).toBeTruthy();
		await page.goto(pageUrl);

		const block = page.locator('.post-lists-tab.newsly__post_list_tab');
		const content = block.locator('#post-list-tab-post-content');
		await expect(content.locator('.post-card').first()).toBeVisible();

		const initialTitles = await content
			.locator('.post-card__title')
			.allTextContents();

		const categoryTab = block.locator(
			`.tablinks[data-cat-slug="${CATEGORY_SLUG}"]`
		);
		await expect(categoryTab).toBeVisible();
		await categoryTab.click();

		await expect(categoryTab).toHaveClass(/active/);
		await expect(categoryTab).toHaveAttribute('aria-selected', 'true');

		const allTab = block.locator('.tablinks[data-cat-slug=""]');
		await expect(allTab).not.toHaveClass(/active/);
		await expect(allTab).toHaveAttribute('aria-selected', 'false');

		// Content actually changed - proves the AJAX response replaced the
		// panel rather than just the tab's own styling.
		await expect
			.poll(
				() => content.locator('.post-card__title').allTextContents(),
				{ timeout: 10000 }
			)
			.not.toEqual(initialTitles);

		await expect(
			content.locator('.post-card .post-card__category').first()
		).toBeVisible();
	});

	test('clicking the already-active tab is a no-op (no AJAX request fired)', async ({
		page,
	}) => {
		expect(pageUrl).toBeTruthy();
		await page.goto(pageUrl);

		const block = page.locator('.post-lists-tab.newsly__post_list_tab');
		const content = block.locator('#post-list-tab-post-content');
		await expect(content.locator('.post-card').first()).toBeVisible();

		let ajaxRequestCount = 0;
		page.on('request', (request) => {
			if (
				request.url().includes('admin-ajax.php') &&
				(request.postData() || '').includes(
					'handle_category_post_content'
				)
			) {
				ajaxRequestCount++;
			}
		});

		const allTab = block.locator('.tablinks[data-cat-slug=""]');
		await expect(allTab).toHaveClass(/active/); // already active by default
		const titlesBefore = await content
			.locator('.post-card__title')
			.allTextContents();

		await allTab.click();
		// There's no positive event to await here (the whole point is that
		// nothing happens) - a short bounded wait is the only way to give a
		// would-be stray request a chance to show up.
		await page.waitForTimeout(500);

		expect(ajaxRequestCount).toBe(0);
		expect(
			await content.locator('.post-card__title').allTextContents()
		).toEqual(titlesBefore);
	});

	test('first post title link on the frontend is reachable via keyboard Tab navigation', async ({
		page,
	}) => {
		expect(pageUrl).toBeTruthy();
		await page.goto(pageUrl);

		const firstLink = page
			.locator(
				'.post-lists-tab.newsly__post_list_tab #post-list-tab-post-content .post-card'
			)
			.first()
			.locator('a.post-card__title');
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
});

test.describe.serial('Post Lists Tab block - multiple instances on one page', () => {
	let pageId;
	let pageUrl;

	test.beforeEach(async ({ page }) => {
		await login(page);
	});

	test.afterAll(async ({ browser }) => {
		await trashPage(browser, pageId, PAGE_TITLE_TWO_BLOCKS);
	});

	test('creates a page with two Post Lists Tab blocks and publishes it', async ({
		page,
	}) => {
		await page.goto('/wp-admin/post-new.php?post_type=page');

		const editorFrame = page.frameLocator('iframe[name="editor-canvas"]');
		await expect(
			editorFrame.getByRole('textbox', { name: 'Add title' })
		).toBeVisible({ timeout: 15000 });
		await editorFrame
			.getByRole('textbox', { name: 'Add title' })
			.fill(PAGE_TITLE_TWO_BLOCKS);

		await insertPostListsTabBlock(page);
		await insertPostListsTabBlock(page);

		const blocks = editorFrame.locator(
			'.wp-block-newsly-block-post-lists-tab'
		);
		await expect(blocks).toHaveCount(2);
		await expect(blocks.nth(0).locator('.post-card').first()).toBeVisible({
			timeout: 10000,
		});
		await expect(blocks.nth(1).locator('.post-card').first()).toBeVisible({
			timeout: 10000,
		});

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

	test('switching a tab in the second block does not affect the first block (regression)', async ({
		page,
	}) => {
		expect(pageUrl).toBeTruthy();
		await page.goto(pageUrl);

		const blocks = page.locator('.post-lists-tab.newsly__post_list_tab');
		await expect(blocks).toHaveCount(2);

		const blockA = blocks.nth(0);
		const blockB = blocks.nth(1);

		await expect(
			blockA.locator('#post-list-tab-post-content .post-card').first()
		).toBeVisible();

		const blockATitlesBefore = await blockA
			.locator('#post-list-tab-post-content .post-card__title')
			.allTextContents();
		const allTabA = blockA.locator('.tablinks[data-cat-slug=""]');
		await expect(allTabA).toHaveClass(/active/);

		// Click block B's category tab - not block A's.
		const tabB = blockB.locator(
			`.tablinks[data-cat-slug="${CATEGORY_SLUG}"]`
		);
		await expect(tabB).toBeVisible();
		await tabB.click();
		await expect(tabB).toHaveClass(/active/);

		// Block B's own "All" tab is no longer active.
		const allTabB = blockB.locator('.tablinks[data-cat-slug=""]');
		await expect(allTabB).not.toHaveClass(/active/);

		// Block A must be completely unaffected: still on "All", same posts.
		await expect(allTabA).toHaveClass(/active/);
		const blockATitlesAfter = await blockA
			.locator('#post-list-tab-post-content .post-card__title')
			.allTextContents();
		expect(blockATitlesAfter).toEqual(blockATitlesBefore);
	});
});
