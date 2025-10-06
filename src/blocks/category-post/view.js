// Tab functionality with keyboard navigation
document.addEventListener('DOMContentLoaded', function() {
	const categoryTabs = document.querySelectorAll('.newsly__category_post .cat-label button');
	let currentTabIndex = 0;
	
	// Function to switch to a specific tab (navigation only)
	function navigateToTab(tabIndex) {
		if (tabIndex < 0 || tabIndex >= categoryTabs.length) return;
		
		const tab = categoryTabs[tabIndex];
		currentTabIndex = tabIndex;
		
		// Update tab button states
		categoryTabs.forEach(tab => {
			tab.classList.remove('border-blue-500', 'text-blue-600');
			tab.classList.add('border-transparent', 'text-gray-500');
			tab.setAttribute('aria-selected', 'false');
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
		console.log('Activating category:', categoryId);
		
		// Hide ALL tab contents first
		const allTabContents = document.querySelectorAll('[id^="category-tab-content-"]');
		allTabContents.forEach(content => {
			content.className = 'tab-content hidden';
			content.setAttribute('aria-hidden', 'true');
			content.setAttribute('aria-expanded', 'false');
		});
		
		// Show the selected tab content
		const categoryTabContent = document.getElementById(`category-tab-content-${categoryId}`);
		if (categoryTabContent) {
			categoryTabContent.className = 'tab-content active grid gs-cols-3 gap-5';
			categoryTabContent.setAttribute('aria-hidden', 'false');
			categoryTabContent.setAttribute('aria-expanded', 'true');
		}
		
		// Update tab button states
		categoryTabs.forEach(tab => {
			tab.classList.remove('border-blue-500', 'text-blue-600');
			tab.classList.add('border-transparent', 'text-gray-500');
			tab.setAttribute('aria-selected', 'false');
		});
		
		// Add active styling to current tab
		tab.classList.remove('border-transparent', 'text-gray-500');
		tab.classList.add('border-blue-500', 'text-blue-600');
		tab.setAttribute('aria-selected', 'true');
		
		currentTabIndex = tabIndex;
	}
	
	// Add click event listeners
	categoryTabs.forEach((tab, index) => {
		tab.addEventListener('click', function() {
			activateTab(index);
		});
		
		// Add keyboard event listeners
		tab.addEventListener('keydown', function(e) {
			switch(e.key) {
				case 'ArrowRight':
					e.preventDefault();
					navigateToTab((currentTabIndex + 1) % categoryTabs.length);
					break;
				case 'ArrowLeft':
					e.preventDefault();
					navigateToTab((currentTabIndex - 1 + categoryTabs.length) % categoryTabs.length);
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
	
	// Add global keyboard navigation
	document.addEventListener('keydown', function(e) {
		// Only handle if a category tab block is in focus
		const activeElement = document.activeElement;
		if (activeElement && activeElement.closest('.gts__category_post')) {
			switch(e.key) {
				case 'ArrowRight':
					e.preventDefault();
					navigateToTab((currentTabIndex + 1) % categoryTabs.length);
					break;
				case 'ArrowLeft':
					e.preventDefault();
					navigateToTab((currentTabIndex - 1 + categoryTabs.length) % categoryTabs.length);
					break;
			}
		}
	});
	
	// Set first tab as active by default
	// if (categoryTabs.length > 0) {
	// 	const firstTab = categoryTabs[0];
	// 	const firstCategoryId = firstTab.getAttribute('data-category-id');
		
	// 	// Set first tab as active
	// 	firstTab.classList.remove('border-transparent', 'text-gray-500');
	// 	firstTab.classList.add('border-blue-500', 'text-blue-600');
		
	// 	// Show first tab content
	// 	const firstContent = document.getElementById(`category-tab-content-${firstCategoryId}`);
	// 	if (firstContent) {
	// 		firstContent.className = 'tab-content active grid gs-cols-3';
	// 	}
		
	// 	// Hide other tab contents
	// 	const allTabContents = document.querySelectorAll('[id^="category-tab-content-"]');
	// 	allTabContents.forEach(content => {
	// 		if (content.id !== `category-tab-content-${firstCategoryId}`) {
	// 			content.className = 'tab-content hidden';
	// 		}
	// 	});
	// }
});