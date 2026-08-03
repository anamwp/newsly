/**
 * E2E tests for the Category Post block.
 *
 * Unlike tests/e2e/block-test-featured-posts.spec.js (which only logs
 * soft "⚠️"/"✅" messages and never calls expect()), every check here is a
 * real Playwright assertion so a regression actually fails the test run.
 *
 * These tests specifically cover a bug found and fixed in this block:
 * `view.js` (the frontend tab-switch script) used to query/mutate tab
 * panels with `document.querySelectorAll(...)` across the *whole page*
 * instead of scoping to the clicked block instance. With two or more
 * Category Post blocks on the same page, clicking a tab in one block hid
 * every other block's active panel too (see the "does not clear other
 * block instances" test below).
 */

const { test, expect } = require('@playwright/test');
require('dotenv').config();

const WP_ADMIN_USERNAME = process.env.WP_ADMIN_USERNAME || 'admin';
const WP_ADMIN_PASSWORD = process.env.WP_ADMIN_PASSWORD || 'password';

// Category names assumed present in the site's seeded demo content, each
// with multiple posts. Also relied on by block-test-featured-posts.spec.js.
const BLOCK_A_CATEGORY = 'history';
const BLOCK_B_CATEGORIES = ['ancient', 'market'];

const PAGE_TITLE = 'Category Post E2E Test Page';

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
 * Opens the block inserter and inserts a Category Post block. Assumes the
 * inserted block becomes the selected block (default Gutenberg behavior),
 * so the Inspector sidebar afterwards refers to this block.
 * @param {import('@playwright/test').Page} page
 */
async function insertCategoryPostBlock(page) {
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
	await searchInput.fill('Category Post');

	const option = page.getByRole('option', { name: 'Category Post' });
	await expect(option).toBeVisible({ timeout: 10000 });
	await option.click();
}

/**
 * Selects one or more categories in the currently-selected Category Post
 * block's "Choose Categories" sidebar multi-select.
 * @param {import('@playwright/test').Page} page
 * @param {string[]} categoryNames
 */
async function selectCategories(page, categoryNames) {
	const listbox = page.getByRole('listbox', { name: 'Choose Categories' });
	await expect(listbox).toBeVisible({ timeout: 10000 });

	for (let i = 0; i < categoryNames.length; i++) {
		const option = listbox.getByRole('option', {
			name: categoryNames[i],
			exact: true,
		});
		await option.click(i === 0 ? {} : { modifiers: ['ControlOrMeta'] });
	}
}

test.describe.serial('Category Post block', () => {
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

	test('creates a page with two Category Post blocks using different categories and publishes it', async ({
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

		// Block A - single category.
		await insertCategoryPostBlock(page);
		await selectCategories(page, [BLOCK_A_CATEGORY]);

		const blockA = editorFrame.locator('.newsly__category_post').nth(0);
		await expect(
			blockA.getByRole('tab', { name: BLOCK_A_CATEGORY })
		).toBeVisible({ timeout: 10000 });
		// Only the active tab's panel is visible - other categories the block
		// knows about are rendered but `hidden`, so scope to `.active`.
		await expect(
			blockA.locator('.tab-content.active .newsly__post_card').first()
		).toBeVisible({ timeout: 10000 });

		// Block B - two categories, so it has its own internal tabs too.
		await insertCategoryPostBlock(page);
		await selectCategories(page, BLOCK_B_CATEGORIES);

		const blockB = editorFrame.locator('.newsly__category_post').nth(1);
		for (const categoryName of BLOCK_B_CATEGORIES) {
			await expect(
				blockB.getByRole('tab', { name: categoryName })
			).toBeVisible({ timeout: 10000 });
		}
		await expect(
			blockB.locator('.tab-content.active .newsly__post_card').first()
		).toBeVisible({ timeout: 10000 });

		// Close the block inserter (still open from the last block pick) so
		// it can't overlap/intercept the publish flow's own buttons.
		await page.keyboard.press('Escape');

		// Publish.
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

	test('renders both blocks independently on the frontend after publish', async ({
		page,
	}) => {
		expect(pageUrl).toBeTruthy();
		await page.goto(pageUrl);

		const blocks = page.locator('.newsly__category_post');
		await expect(blocks).toHaveCount(2);

		const blockA = blocks.nth(0);
		await expect(
			blockA.getByRole('tab', { name: BLOCK_A_CATEGORY, selected: true })
		).toBeVisible();
		await expect(
			blockA.locator('.tab-content.active article.newsly__post_card')
		).not.toHaveCount(0);

		// Block B has two categories; which one ends up active by default is
		// an implementation detail (it's whichever the native <select
		// multiple> reports first, not necessarily click order) - just
		// assert exactly one of its own tabs is selected and has content.
		const blockB = blocks.nth(1);
		await expect(blockB.getByRole('tab', { selected: true })).toHaveCount(1);
		await expect(
			blockB.locator('.tab-content.active article.newsly__post_card')
		).not.toHaveCount(0);
	});

	test('switching a tab in the second block does not clear the first block (regression)', async ({
		page,
	}) => {
		expect(pageUrl).toBeTruthy();
		await page.goto(pageUrl);

		const blocks = page.locator('.newsly__category_post');
		const blockA = blocks.nth(0);
		const blockB = blocks.nth(1);

		// Baseline: block A is showing its "history" content before any
		// interaction with block B.
		const blockAArticlesBefore = await blockA
			.locator('.tab-content.active article.newsly__post_card')
			.count();
		expect(blockAArticlesBefore).toBeGreaterThan(0);

		// Block B's initially-active tab, plus its own content, before we
		// touch anything - used to prove the switch below actually changes
		// block B's content and not just its tab styling.
		const initiallyActiveTabName = await blockB
			.getByRole('tab', { selected: true })
			.textContent();
		const blockBContentBefore = await blockB
			.locator('.tab-content.active')
			.textContent();

		// Click block B's *other* tab (whichever one wasn't already active).
		const otherTab = blockB
			.getByRole('tab', { selected: false })
			.filter({ hasNotText: initiallyActiveTabName });
		const otherTabName = await otherTab.textContent();
		await otherTab.click();

		// Block B actually switched: the other tab is now selected and its
		// panel content is different from what was showing before.
		await expect(
			blockB.getByRole('tab', { name: otherTabName, selected: true })
		).toBeVisible();
		await expect(blockB.locator('.tab-content.active')).toHaveCount(1);
		await expect(blockB.locator('.tab-content.active')).not.toHaveText(
			blockBContentBefore
		);

		// Block A must be completely unaffected: same tab still selected,
		// same panel still marked active, and its posts are still rendered.
		// Before the fix, this failed - block B's click hid every panel on
		// the page (including block A's) via a document-wide querySelectorAll.
		await expect(
			blockA.getByRole('tab', { name: BLOCK_A_CATEGORY, selected: true })
		).toBeVisible();
		await expect(blockA.locator('.tab-content.active')).toHaveCount(1);
		await expect(blockA.locator('.tab-content.hidden')).toHaveCount(0);

		const blockAArticlesAfter = await blockA
			.locator('.tab-content.active article.newsly__post_card')
			.count();
		expect(blockAArticlesAfter).toBe(blockAArticlesBefore);
	});
});
