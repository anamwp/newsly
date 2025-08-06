/**
 * E2E tests for Admin Options functionality
 *
 * These tests verify the admin options page behavior in the browser.
 * Note: The singleton instantiation (line 21 in Options.php) is covered by PHP unit tests,
 * but this E2E test verifies the admin interface works correctly.
 */

const { test, expect } = require('@playwright/test');

test.describe('Admin Options Page', () => {
	test.beforeEach(async ({ page }) => {
		// Login as admin user
		await page.goto('/wp-admin');
		await page.fill('#user_login', 'admin');
		await page.fill('#user_pass', 'password');
		await page.click('#wp-submit');
	});

	test('should display Gutenberg Starter settings page', async ({ page }) => {
		// Navigate to the plugin settings page
		await page.goto('/wp-admin/options-general.php?page=gutenberg_starter');

		// Verify the page loads and displays the correct title
		await expect(page.locator('h1')).toContainText(
			'Gutenberg Starter Settings'
		);

		// Verify the API key field is present
		await expect(
			page.locator('#gutenberg_starter_movie_api_key')
		).toBeVisible();

		// Verify the form is present
		await expect(page.locator('form[method="post"]')).toBeVisible();

		// Verify the submit button is present
		await expect(page.locator('#submit')).toBeVisible();
	});

	test('should save API key setting', async ({ page }) => {
		// Navigate to the plugin settings page
		await page.goto('/wp-admin/options-general.php?page=gutenberg_starter');

		// Fill in the API key
		const testApiKey = 'test_api_key_12345';
		await page.fill('#gutenberg_starter_movie_api_key', testApiKey);

		// Submit the form
		await page.click('#submit');

		// Verify success message or that we're back on the settings page
		await expect(page.locator('h1')).toContainText(
			'Gutenberg Starter Settings'
		);

		// Verify the API key was saved by checking the field value
		await expect(
			page.locator('#gutenberg_starter_movie_api_key')
		).toHaveValue(testApiKey);
	});

	test('should validate empty API key', async ({ page }) => {
		// Navigate to the plugin settings page
		await page.goto('/wp-admin/options-general.php?page=gutenberg_starter');

		// Clear the API key field
		await page.fill('#gutenberg_starter_movie_api_key', '');

		// Submit the form
		await page.click('#submit');

		// Verify we're still on the settings page (form should accept empty values)
		await expect(page.locator('h1')).toContainText(
			'Gutenberg Starter Settings'
		);

		// Verify the field is empty
		await expect(
			page.locator('#gutenberg_starter_movie_api_key')
		).toHaveValue('');
	});

	test('should display help text for API key', async ({ page }) => {
		// Navigate to the plugin settings page
		await page.goto('/wp-admin/options-general.php?page=gutenberg_starter');

		// Verify the help text is displayed
		await expect(page.locator('.description')).toContainText(
			'Enter your API key from The Movie Database'
		);
		await expect(page.locator('.description')).toContainText(
			'https://www.themoviedb.org/settings/api'
		);
	});
});

/**
 * Note about PHP singleton testing:
 *
 * The line "self::$instance = new self();" (line 21 in Options.php) cannot be directly
 * tested in E2E tests since it's PHP backend code. This line is properly covered by
 * the PHP unit test "test_singleton_first_instantiation" in test-admin-options.php.
 *
 * E2E tests are designed to test user interactions and verify that the resulting
 * admin interface works correctly, which indirectly validates that the singleton
 * pattern is working (since the admin page displays correctly).
 */
