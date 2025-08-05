const { defineConfig } = require('@playwright/test');
// Load environment variables
require('dotenv').config();

module.exports = defineConfig({
	testDir: './tests/e2e',
	use: {
		baseURL: process.env.WP_BASE_URL || 'https://anamstarter.local',
	},
	projects: [{ name: 'chromium' }],
});
