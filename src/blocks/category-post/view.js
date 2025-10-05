// now implment tab functionality for save js file
document.addEventListener('DOMContentLoaded', function() {
	const categoryTabs = document.querySelectorAll('.newsly__category_post .cat-label button');
	categoryTabs.forEach(tab => {
		tab.addEventListener('click', function() {
			const categoryId = tab.getAttribute('data-category-id');
			console.log('categoryId', categoryId);
			 // Hide ALL tab contents first
			 const allTabContents = document.querySelectorAll('[id^="category-tab-content-"]');
			 allTabContents.forEach(content => {
				 content.className = 'tab-content hidden'; // Reset to just hidden
			 });
			// Show the selected tab content
			const categoryTabContent = document.getElementById(`category-tab-content-${categoryId}`);
			if (categoryTabContent) {
				categoryTabContent.className = 'tab-content active grid gs-cols-3'; // Set correct classes
			}
			
			// Update tab button states
			const allTabs = document.querySelectorAll('.cat-label button');
			allTabs.forEach(tab => {
				// Remove active styling
				tab.classList.remove('border-blue-500', 'text-blue-600');
				tab.classList.add('border-transparent', 'text-gray-500');
			});
			
			// Add active styling to clicked tab
			this.classList.remove('border-transparent', 'text-gray-500');
			this.classList.add('border-blue-500', 'text-blue-600');
			
		});
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