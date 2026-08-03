// Tab functionality with keyboard navigation.
// Scoped per `.newsly__category_post` block instance so that multiple
// Category Post blocks on the same page don't interfere with each other's
// tab state (previously this queried/hid tab content across the whole
// document, so switching tabs on one block would hide every other block's
// active panel too, since none of their category IDs matched the tab that
// was just clicked).
document.addEventListener('DOMContentLoaded', function () {
	const blocks = document.querySelectorAll('.newsly__category_post');

	blocks.forEach((block) => {
		const categoryTabs = Array.from(
			block.querySelectorAll('.cat-label button')
		);

		if (categoryTabs.length === 0) {
			return;
		}

		let currentTabIndex = categoryTabs.findIndex(
			(tab) => tab.getAttribute('aria-selected') === 'true'
		);
		if (currentTabIndex === -1) {
			currentTabIndex = 0;
		}

		// Function to switch to a specific tab (navigation only)
		function navigateToTab(tabIndex) {
			if (tabIndex < 0 || tabIndex >= categoryTabs.length) return;

			const tab = categoryTabs[tabIndex];
			currentTabIndex = tabIndex;

			// Update tab button states
			categoryTabs.forEach((t) => {
				t.classList.remove('border-blue-500', 'text-blue-600');
				t.classList.add('border-transparent', 'text-gray-500');
				t.setAttribute('aria-selected', 'false');
			});

			// Add active styling to current tab
			tab.classList.remove('border-transparent', 'text-gray-500');
			tab.classList.add('border-blue-500', 'text-blue-600');
			tab.setAttribute('aria-selected', 'true');

			// Focus the tab
			tab.focus();
		}

		// Function to activate a tab (show content)
		function activateTab(tabIndex) {
			if (tabIndex < 0 || tabIndex >= categoryTabs.length) return;

			const tab = categoryTabs[tabIndex];
			const categoryId = tab.getAttribute('data-category-id');
			const postColumn = block.getAttribute('data-post-column') || 3;

			// Hide tab contents for THIS block only
			const allTabContents = block.querySelectorAll(
				'[id^="category-tab-content-"]'
			);
			allTabContents.forEach((content) => {
				content.className = 'tab-content hidden';
				content.setAttribute('aria-hidden', 'true');
				content.setAttribute('aria-expanded', 'false');
			});

			// Show the selected tab content (scoped to this block)
			const categoryTabContent = block.querySelector(
				`#category-tab-content-${categoryId}`
			);
			if (categoryTabContent) {
				categoryTabContent.className = `tab-content active grid gs-cols-${postColumn} gap-5`;
				categoryTabContent.setAttribute('aria-hidden', 'false');
				categoryTabContent.setAttribute('aria-expanded', 'true');
			}

			// Update tab button states
			categoryTabs.forEach((t) => {
				t.classList.remove('border-blue-500', 'text-blue-600');
				t.classList.add('border-transparent', 'text-gray-500');
				t.setAttribute('aria-selected', 'false');
			});

			// Add active styling to current tab
			tab.classList.remove('border-transparent', 'text-gray-500');
			tab.classList.add('border-blue-500', 'text-blue-600');
			tab.setAttribute('aria-selected', 'true');

			currentTabIndex = tabIndex;
		}

		// Add click event listeners
		categoryTabs.forEach((tab, index) => {
			tab.addEventListener('click', function () {
				activateTab(index);
			});

			// Add keyboard event listeners
			tab.addEventListener('keydown', function (e) {
				switch (e.key) {
					case 'ArrowRight':
						e.preventDefault();
						navigateToTab((currentTabIndex + 1) % categoryTabs.length);
						break;
					case 'ArrowLeft':
						e.preventDefault();
						navigateToTab(
							(currentTabIndex - 1 + categoryTabs.length) %
								categoryTabs.length
						);
						break;
					case 'Enter':
					case ' ':
						e.preventDefault();
						activateTab(index);
						break;
				}
			});

			// Make tabs focusable
			tab.setAttribute('tabindex', '0');
		});

		// Add keyboard navigation scoped to this block instance
		block.addEventListener('keydown', function (e) {
			switch (e.key) {
				case 'ArrowRight':
					e.preventDefault();
					navigateToTab((currentTabIndex + 1) % categoryTabs.length);
					break;
				case 'ArrowLeft':
					e.preventDefault();
					navigateToTab(
						(currentTabIndex - 1 + categoryTabs.length) %
							categoryTabs.length
					);
					break;
			}
		});
	});
});
