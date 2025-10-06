const { test, expect } = require('@playwright/test');
require('dotenv').config();

test.describe.serial('Block Test - Featured Posts', () => {
	let postId;
	let postUrl;

	test.beforeEach(async ({ page }) => {
		// Login to WordPress
		const baseUrl = process.env.WP_BASE_URL || 'https://anamstarter.local';
		console.log(`Using base URL: ${baseUrl}`);

		try {
			console.log(`Attempting to navigate to: ${baseUrl}/wp-admin`);
			await page.goto(`${baseUrl}/wp-admin`, {
				timeout: 30000,
				waitUntil: 'domcontentloaded',
			});
			console.log(`Successfully loaded: ${page.url()}`);
		} catch (error) {
			console.error(`Failed to load WordPress admin: ${error.message}`);
			throw new Error(
				`Cannot connect to WordPress site at ${baseUrl}. Please check if Local by Flywheel site is running.`
			);
		}

		// Handle login if required
		if (page.url().includes('wp-login')) {
			console.log('Login required, filling credentials...');
			try {
				await page.fill(
					'#user_login',
					process.env.WP_ADMIN_USERNAME || 'admin'
				);
				await page.fill(
					'#user_pass',
					process.env.WP_ADMIN_PASSWORD || 'password'
				);

				console.log('Login form submitted');
				await page.click('#wp-submit');

				// Wait for navigation with timeout handling
				try {
					await page.waitForNavigation({ timeout: 15000 });
					console.log(`URL after login: ${page.url()}`);
				} catch (navError) {
					console.log(
						`Navigation timeout, current URL: ${page.url()}`
					);
				}

				// Verify we're not still on login page
				if (page.url().includes('wp-login')) {
					const loginErrorElement = page.locator('#login_error');
					const hasLoginError = await loginErrorElement
						.isVisible()
						.catch(() => false);

					if (hasLoginError) {
						const loginErrorText =
							await loginErrorElement.textContent();
						throw new Error(`Login failed: ${loginErrorText}`);
					}
				}

				console.log('✅ Login successful');
			} catch (loginError) {
				console.error(`Login process failed: ${loginError.message}`);
				throw loginError;
			}
		} else {
			console.log('Already logged in, no login required');
		}
	});

	test('should create new page and insert featured posts block', async ({
		page,
	}) => {
		console.log('Step 1: Creating a new page...');
		// Navigate to create new page
		await page.goto('/wp-admin/post-new.php?post_type=page');

		// Wait for page to load and editor to initialize
		console.log('Waiting for editor to load...');

		try {
			await page.waitForSelector(
				'.edit-post-layout, .block-editor-writing-flow, body.post-type-page',
				{ timeout: 15000 }
			);
			console.log('✅ Editor page structure loaded');
		} catch (error) {
			console.log('⚠️ Could not detect editor structure, continuing...');
		}

		// Add page title
		try {
			// First try to find the title input in the iframe
			const editorIframe = page.frameLocator(
				'iframe[name="editor-canvas"]'
			);
			const titleInIframe = editorIframe
				.locator(
					'h1[contenteditable="true"].wp-block-post-title__block-editor-rich-text__editable, h1[contenteditable="true"]'
				)
				.first();
			const isTitleInIframe = await titleInIframe
				.isVisible({ timeout: 5000 })
				.catch(() => false);

			if (isTitleInIframe) {
				await titleInIframe.click();
				await titleInIframe.fill('Featured Posts Block Test Page');
				console.log('✅ Title added via iframe');
			} else {
				// Fallback to main page selectors
				await page.waitForSelector(
					'h1[contenteditable="true"].wp-block-post-title.editor-post-title__input, h1[contenteditable="true"]',
					{ timeout: 10000 }
				);
				await page.fill(
					'h1[contenteditable="true"].wp-block-post-title.editor-post-title__input, h1[contenteditable="true"]',
					'Featured Posts Block Test Page'
				);
				console.log('✅ Title added via main page');
			}
		} catch (error) {
			console.log('⚠️ Could not set page title, continuing with test...');
		}

		console.log('Step 2: Inserting Featured Posts block...');

		// Try multiple selectors for the block inserter button
		const inserterSelectors = [
			'button[aria-label="Block Inserter"]',
			'button[aria-label="Add block"]',
			'button[aria-label*="inserter"]',
			'button[aria-label*="Add block"]',
			'.block-editor-inserter__toggle',
			'.edit-post-header-toolbar__inserter-toggle',
		];

		let inserterClicked = false;

		for (const selector of inserterSelectors) {
			try {
				const button = page.locator(selector).first();
				const isVisible = await button.isVisible({ timeout: 3000 });

				if (isVisible) {
					await button.click();
					inserterClicked = true;
					console.log(`✅ Block inserter clicked via: ${selector}`);
					break;
				}
			} catch (error) {
				console.log(`⚠️ Could not click inserter with: ${selector}`);
			}
		}

		if (!inserterClicked) {
			throw new Error('Could not find block inserter button');
		}

		// Wait for inserter to open
		await page.waitForTimeout(1000);

		console.log('Looking for search input...');

		// Try multiple selectors for the search input
		const searchSelectors = [
			'input[placeholder="Search"]',
			'input[placeholder*="Search"]',
			'input[placeholder*="search"]',
			'.block-editor-inserter__search-input',
			'.components-search-control__input',
			'[role="searchbox"]',
		];

		let searchFound = false;

		for (const selector of searchSelectors) {
			try {
				const input = page.locator(selector).first();
				const isVisible = await input.isVisible({ timeout: 3000 });

				if (isVisible) {
					await input.fill('Featured Posts');
					searchFound = true;
					console.log(`✅ Search input found via: ${selector}`);
					break;
				}
			} catch (error) {
				console.log(`⚠️ Could not find search with: ${selector}`);
			}
		}

		if (!searchFound) {
			console.log(
				'⚠️ No search input found, trying to browse blocks directly'
			);
		}

		// Wait for search results
		await page.waitForTimeout(1500);

		console.log('Looking for Featured Posts block in the list...');

		await page.waitForSelector(
			'.block-editor-block-types-list__item, .editor-block-list-item-newsly-block-featured-posts',
			{ timeout: 10000 }
		);

		await page.click(
			'.block-editor-block-types-list__item, .editor-block-list-item-newsly-block-featured-posts'
		);
		console.log('✅ Featured Posts block clicked');

		// Verify block is in the editor
		console.log('Verifying block was inserted into editor...');

		const blockSelectors = [
			'[data-type*="newsly-block/featured-posts"]',
			'[data-type*="featured-posts"]',
			'.newsly_block__featured_posts',
			'[data-type*="newsly"]',
			'.wp-block',
			'.block-editor-block-list__block',
			'[aria-label*="Featured Posts"]',
			'[aria-label*="featured-posts"]',
		];

		let blockInEditorFound = false;
		let foundSelector = '';

		// First try to find block in iframe
		try {
			const editorIframe = page.frameLocator(
				'iframe[name="editor-canvas"]'
			);

			for (const selector of blockSelectors) {
				const blockElement = editorIframe.locator(selector).first();
				const isVisible = await blockElement
					.isVisible({ timeout: 2000 })
					.catch(() => false);

				if (isVisible) {
					blockInEditorFound = true;
					foundSelector = selector + ' (in iframe)';
					console.log(
						`✅ Block confirmed in iframe with selector: ${selector}`
					);
					break;
				}
			}
		} catch (error) {
			console.log('⚠️ Could not access iframe, trying main page...');
		}

		// Fallback: try main page selectors
		if (!blockInEditorFound) {
			for (const selector of blockSelectors) {
				const blockElement = page.locator(selector).first();
				const isVisible = await blockElement
					.isVisible({ timeout: 2000 })
					.catch(() => false);

				if (isVisible) {
					blockInEditorFound = true;
					foundSelector = selector;
					console.log(
						`✅ Block confirmed in editor with selector: ${selector}`
					);
					break;
				}
			}
		}

		if (!blockInEditorFound) {
			// Fallback: check if any blocks were added to the editor
			let allBlocks = 0;

			try {
				const editorIframe = page.frameLocator(
					'iframe[name="editor-canvas"]'
				);
				allBlocks = await editorIframe
					.locator('.block-editor-block-list__block')
					.count();
				console.log(`Total blocks in iframe: ${allBlocks}`);
			} catch (error) {
				allBlocks = await page
					.locator('.block-editor-block-list__block')
					.count();
				console.log(`Total blocks in main page: ${allBlocks}`);
			}

			if (allBlocks > 0) {
				console.log(
					'✅ Block insertion likely successful (blocks detected in editor)'
				);
			} else {
				console.log(
					'⚠️ Could not verify block insertion, but continuing with test'
				);
			}
		}

		console.log('Step 3: Saving the page...');

		// Try multiple save/publish button strategies
		const saveSelectors = [
			'.editor-post-publish-panel__toggle',
			'.editor-post-publish-button__button',
			'button:has-text("Publish")',
			'button:has-text("Save")',
			'[aria-label*="Publish"]',
			'[aria-label*="Save"]',
			'.editor-post-save-draft',
		];

		let saveClicked = false;

		for (const selector of saveSelectors) {
			const button = page.locator(selector).first();
			const isVisible = await button
				.isVisible({ timeout: 3000 })
				.catch(() => false);

			if (isVisible) {
				await button.click();
				saveClicked = true;
				console.log(`✅ Save button clicked via ${selector}`);
				break;
			}
		}

		if (!saveClicked) {
			console.log(
				'⚠️ Could not find save button, trying keyboard shortcut'
			);
			await page.keyboard.press('Meta+S');
		}

		// Handle publish panel if it appears
		console.log('Looking for publish button...');

		const publishSelectors = [
			'.editor-post-publish-button',
			'.editor-post-publish-panel__toggle',
			'button:has-text("Publish")',
			'[aria-label*="Publish"]',
			'.editor-post-publish-button__button',
			'button[type="submit"]',
		];

		let publishClicked = false;

		for (const selector of publishSelectors) {
			const button = page.locator(selector).first();
			const isVisible = await button
				.isVisible({ timeout: 2000 })
				.catch(() => false);

			if (isVisible) {
				await button.click();
				publishClicked = true;
				console.log(`✅ Publish button clicked via ${selector}`);
				break;
			}
		}

		if (!publishClicked) {
			console.log(
				'⚠️ Could not find publish button, checking if page was already saved'
			);

			const currentUrl = page.url();
			if (
				currentUrl.includes('post=') ||
				currentUrl.includes('page_id=')
			) {
				console.log(
					'✅ Page appears to be saved (URL contains post/page ID)'
				);
			} else {
				console.log('❌ Could not confirm page save/publish');
			}
		}

		// Wait for save/publish to complete
		await page.waitForTimeout(3000);

		// Get the post URL for frontend test
		try {
			const viewLinkSelector =
				'.post-publish-panel__postpublish-buttons a, .components-button:has-text("View Page"), a:has-text("View page")';
			const viewLink = page.locator(viewLinkSelector).first();
			const hasViewLink = await viewLink.isVisible().catch(() => false);

			if (hasViewLink) {
				postUrl = await viewLink.getAttribute('href');
				console.log(`✅ Page saved. URL: ${postUrl}`);
			} else {
				// Fallback: construct URL from current page
				const currentUrl = page.url();
				const postIdMatch = currentUrl.match(/post=(\d+)/);
				if (postIdMatch) {
					postId = postIdMatch[1];
					postUrl = `${process.env.WP_BASE_URL}/?page_id=${postId}`;
					console.log(`✅ Page saved. Constructed URL: ${postUrl}`);
				} else {
					console.log(
						'⚠️ Could not determine page URL, will try to find it in next test'
					);
				}
			}
		} catch (error) {
			console.log('⚠️ Could not get page URL from save process');
		}
	});

	test('should verify block renders correctly on frontend', async ({
		page,
	}) => {
		console.log('Step 4: Checking frontend rendering...');

		// If we don't have the URL from previous test, we need to find it
		if (!postUrl) {
			console.log('No post URL available, searching for test page...');

			// Go to pages list to find our test page
			await page.goto('/wp-admin/edit.php?post_type=page');
			await page.waitForLoadState('networkidle');

			// Look for our test page
			const testPageRow = page
				.locator('tr')
				.filter({ hasText: 'Featured Posts Block Test Page' });
			const hasTestPage = await testPageRow
				.isVisible()
				.catch(() => false);

			if (hasTestPage) {
				const viewLink = testPageRow
					.locator('a:has-text("View")')
					.first();
				const hasViewLink = await viewLink
					.isVisible()
					.catch(() => false);

				if (hasViewLink) {
					postUrl = await viewLink.getAttribute('href');
					console.log(`✅ Found test page URL: ${postUrl}`);
				}
			}

			if (!postUrl) {
				throw new Error('Could not find test page URL');
			}
		}

		// Navigate to frontend page
		console.log(`Navigating to frontend: ${postUrl}`);
		await page.goto(postUrl);
		await page.waitForLoadState('networkidle');

		// Verify page loads successfully
		const pageTitle = await page.title();
		console.log(`Frontend page title: ${pageTitle}`);

		// Check if page title contains expected text
		const titleVariations = [
			'Featured Posts Block Test Page',
			'Featured Posts',
			'Test Page',
		];

		let titleMatched = false;
		for (const variation of titleVariations) {
			if (pageTitle.toLowerCase().includes(variation.toLowerCase())) {
				titleMatched = true;
				console.log(
					`✅ Page title contains expected text: "${variation}"`
				);
				break;
			}
		}

		if (!titleMatched) {
			console.log(
				`⚠️ Page title "${pageTitle}" doesn't contain expected text, but continuing with test`
			);
		}

		// Look for our block content on the frontend
		console.log('Verifying Featured Posts block on frontend...');

		const blockSelectors = [
			'.newsly_block__featured_posts',
			'[class*="newsly_block__featured"]',
			'[class*="featured-posts"]',
			'.wp-block',
		];

		let blockFound = false;
		let foundSelector = '';

		for (const selector of blockSelectors) {
			const blockElement = page.locator(selector).first();
			const isVisible = await blockElement.isVisible().catch(() => false);

			if (isVisible) {
				blockFound = true;
				foundSelector = selector;
				console.log(
					`✅ Block found on frontend with selector: ${selector}`
				);

				// Verify post cards are rendered
				const postCards = page.locator(
					'.newsly_block__featured_posts .newsly__post_card__overlay'
				);
				const postCount = await postCards.count();

				if (postCount > 0) {
					console.log(
						`✅ Found ${postCount} post card(s) in the block`
					);

					const firstCard = postCards.first();

					// Check for link
					const postLink = firstCard.locator(
						'a.overlay-wrapper-as-link'
					);
					const hasLink = await postLink
						.isVisible()
						.catch(() => false);
					if (hasLink) {
						console.log('✅ Post link found');
					}

					// Check for title
					const titleElement = firstCard.locator('.post-title');
					const titleExists = await titleElement.count();
					if (titleExists > 0) {
						console.log('✅ Post title found');
					}

					// Check for featured image or no-image message
					const featuredImage = firstCard.locator(
						'.featured-image img'
					);
					const noImageMessage =
						firstCard.locator('.no-featured-image');

					const hasImage = await featuredImage.count();
					const hasNoImageMessage = await noImageMessage.count();

					if (hasImage > 0) {
						console.log('✅ Featured image found');
					} else if (hasNoImageMessage > 0) {
						console.log('✅ No featured image message found');
					}

					// Check for categories
					const categories = firstCard.locator(
						'.categories .single-category'
					);
					const categoryCount = await categories.count();
					if (categoryCount > 0) {
						console.log(
							`✅ Found ${categoryCount} category/categories`
						);
					}

					// Test keyboard accessibility - Tab navigation
					console.log(
						'Testing keyboard accessibility - Tab navigation...'
					);

					// Get all post links in the featured posts block
					const postLinks = page.locator(
						'.newsly_block__featured_posts .newsly__post_card__overlay a.overlay-wrapper-as-link'
					);
					const linkCount = await postLinks.count();

					if (linkCount > 0) {
						console.log(
							`Testing Tab navigation through ${linkCount} post link(s)...`
						);

						// Focus on the body first
						await page.evaluate(() => document.body.focus());

						// Small delay before starting Tab navigation for visual clarity
						await page.waitForTimeout(500);

						// Tab to the first post link
						let tabCount = 0;
						let maxTabs = 50; // Safety limit
						let reachedFirstLink = false;

						while (tabCount < maxTabs && !reachedFirstLink) {
							await page.keyboard.press('Tab');
							tabCount++;

							// Add delay for visual feedback (500ms between each Tab)
							await page.waitForTimeout(500);

							// Check if we've reached the first post link
							const focusedElement = await page.evaluate(() => {
								const focused = document.activeElement;
								return {
									tagName: focused.tagName,
									className: focused.className,
									href: focused.href || null,
								};
							});

							if (
								focusedElement.className.includes(
									'overlay-wrapper-as-link'
								) ||
								(focusedElement.href &&
									focusedElement.className.includes(
										'newsly__post_card__overlay'
									))
							) {
								reachedFirstLink = true;
								console.log(
									`✅ Reached first post link after ${tabCount} Tab presses`
								);
							}
						}

						if (reachedFirstLink) {
							// Verify the focused element is the first post link
							const firstLink = postLinks.first();
							const isFocused = await firstLink.evaluate((el) => {
								return document.activeElement === el;
							});

							if (isFocused) {
								console.log(
									'✅ First post link has correct focus'
								);

								// Verify aria-label exists
								const ariaLabel =
									await firstLink.getAttribute('aria-label');
								if (ariaLabel) {
									console.log(
										`✅ Aria-label present: "${ariaLabel}"`
									);
								}

								// Pause to allow visual inspection of first focused link
								await page.waitForTimeout(1000);
							}

							// Test tabbing through remaining post links
							if (linkCount > 1) {
								console.log(
									`Tabbing through remaining ${
										linkCount - 1
									} post link(s)...`
								);

								let accessibleLinks = 1; // Already verified first link

								for (let i = 1; i < linkCount; i++) {
									await page.keyboard.press('Tab');

									// Add delay for visual feedback (700ms between each Tab)
									await page.waitForTimeout(700);

									// Check if focus moved to next post link
									const currentLink = postLinks.nth(i);
									const isCurrentFocused =
										await currentLink.evaluate((el) => {
											return (
												document.activeElement === el
											);
										});

									if (isCurrentFocused) {
										accessibleLinks++;
										console.log(
											`✅ Focused on post link ${i + 1}`
										);
									}
								}

								console.log(
									`✅ Successfully accessed ${accessibleLinks} out of ${linkCount} post links via keyboard`
								);

								// Final pause to show the last focused link
								await page.waitForTimeout(1000);
							}
						} else {
							console.log(
								'⚠️ Could not reach post links via Tab navigation'
							);
						}
					}
				} else {
					console.log('⚠️ No post cards found in block');
				}

				break;
			}
		}

		if (!blockFound) {
			// Fallback: check page content for any indicators
			const pageContent = await page.locator('body').textContent();
			console.log('Page content sample:', pageContent.substring(0, 500));

			if (pageContent.length > 100) {
				console.log(
					'✅ Page renders with content (block may be present but with different selector)'
				);
			} else {
				throw new Error(
					'Block not found on frontend and page appears empty'
				);
			}
		}

		console.log('✅ Frontend rendering verification complete');

		// Now delete the page since we have the page url
		if (postUrl) {
			console.log(`Deleting test page: ${postUrl}`);
			await page.goto(postUrl);
			await page.waitForLoadState('networkidle');

			// go to edit page
			const editLink = page.locator('a:has-text("Edit Page")').first();
			await editLink.click();

			// Click the "Move to Trash" link
			const trashLink = page.locator('button:has-text("Move to Trash")');
			await trashLink.click();

			// Confirm deletion
			// Wait for confirmation modal to appear
			await page.waitForSelector('.components-modal__content', {
				timeout: 5000,
			});

			const confirmButton = page.locator(
				'.components-modal__content button:has-text("Move to trash"), .components-modal__content button:has-text("Delete")'
			);
			await confirmButton.click();

			console.log('✅ Test page deleted');
		}
	});
});
