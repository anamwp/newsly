const { test, expect } = require('@playwright/test');

test('WordPress is accessible', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('body')).toBeVisible();
	console.log('✅ WordPress is accessible!');
});
