import { __ } from '@wordpress/i18n';
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import apiFetch from '@wordpress/api-fetch';

// Frontend component for tab functionality
function CategoryPostFrontend({ blockData, blockElement }) {
	const [activeTab, setActiveTab] = useState(blockData.activeTab || (blockData.selectedCategories.length > 0 ? blockData.selectedCategories[0].id : null));
	const [categoryPosts, setCategoryPosts] = useState({});
	const [currentPosts, setCurrentPosts] = useState([]);
	const [loading, setLoading] = useState(false);

	// Fetch posts for all categories when component mounts
	useEffect(() => {
		if (blockData.selectedCategories.length > 0) {
			setLoading(true);
			const fetchPromises = blockData.selectedCategories.map(category => 
				apiFetch({
					path: `/wp/v2/posts?categories=${category.id}&per_page=24&_embed`,
				})
			);

			Promise.all(fetchPromises)
				.then((responses) => {
					const postsData = {};
					responses.forEach((res, index) => {
						const catId = blockData.selectedCategories[index].id;
						postsData[catId] = res;
					});
					setCategoryPosts(postsData);
					
					// Set initial posts for active tab
					const initialActiveTab = activeTab || blockData.selectedCategories[0].id;
					if (postsData[initialActiveTab]) {
						setCurrentPosts(postsData[initialActiveTab]);
					}
					setLoading(false);
				})
				.catch((err) => {
					console.log('Error fetching posts:', err);
					setLoading(false);
				});
		}
	}, [blockData.selectedCategories]); // Removed activeTab from dependencies

	// Handle tab click
	const handleTabClick = (categoryId) => {
		console.log('Frontend handleTabClick - categoryId:', categoryId);
		setActiveTab(categoryId);
	};

	// Update current posts when activeTab or categoryPosts change
	useEffect(() => {
		if (activeTab && categoryPosts[activeTab]) {
			setCurrentPosts(categoryPosts[activeTab]);
			console.log('Switched to category posts:', categoryPosts[activeTab].length);
		}
	}, [activeTab, categoryPosts]);

	// Update tab styling
	useEffect(() => {
		if (!blockElement) return;
		
		const tabs = blockElement.querySelectorAll('.category-tab');
		tabs.forEach(tab => {
			const categoryId = parseInt(tab.getAttribute('data-category-id'));
			if (categoryId === activeTab) {
				tab.classList.add('active');
			} else {
				tab.classList.remove('active');
			}
		});
	}, [activeTab, blockElement]);

	// Add click event listeners to tabs
	useEffect(() => {
		if (!blockElement) return;
		
		const tabs = blockElement.querySelectorAll('.category-tab');
		const handleClick = (e) => {
			const categoryId = parseInt(e.target.getAttribute('data-category-id'));
			handleTabClick(categoryId);
		};

		tabs.forEach(tab => {
			tab.addEventListener('click', handleClick);
		});

		return () => {
			tabs.forEach(tab => {
				tab.removeEventListener('click', handleClick);
			});
		};
	}, [blockData.selectedCategories, blockElement]);

	// Update posts display
	useEffect(() => {
		if (!blockElement) return;
		
		const postWrapper = blockElement.querySelector('.post-wrapper');
		console.log('Updating posts display:', {
			postWrapper: !!postWrapper,
			currentPostsLength: currentPosts.length,
			postsToShow: blockData.postsToShow
		});
		
		if (postWrapper && currentPosts.length > 0) {
			// Clear existing posts
			postWrapper.innerHTML = '';
			
			// Add new posts with proper structure matching edit.js
			currentPosts.slice(0, blockData.postsToShow).forEach((post, index) => {
				const postElement = document.createElement('div');
				postElement.setAttribute('data-post-serial', index);
				postElement.className = 'newsly__post_card bg-slate-200 p-4 rounded hover:bg-slate-300 transition-all';
				
				// Get categories for this post
				const categories = post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0] 
					? post._embedded['wp:term'][0] 
					: [];
				
				// Get featured image
				const featuredImage = post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0] 
					? post._embedded['wp:featuredmedia'][0] 
					: null;
				
				// Create the exact structure from edit.js
				postElement.innerHTML = `
					${featuredImage ? `
						<div class="mb-4">
							<img class="inline-block w-full rounded" src="${featuredImage.source_url}" alt="${post.title.rendered}">
						</div>
					` : ''}
					${categories.length > 0 ? `
						<div class="mb-3">
							${categories.map(category => `
								<a href="${category.link}" class="inline-block no-underline text-xs text-slate-600 bg-slate-100 hover:bg-slate-400 hover:text-white capitalize p-1 mr-1 rounded-md transition-all" style="margin-right: 10px;">${category.name}</a>
							`).join('')}
						</div>
					` : ''}
					<a href="${post.link}" class="inline-block w-full no-underline font-poppins text-xl text-slate-900 hover:text-slate-600 transition font-medium mb-2">
						<h3>${post.title.rendered}</h3>
					</a>
					<div class="font-poppins text-slate-900 mt-2">
						${post.excerpt.rendered}
					</div>
				`;
				postWrapper.appendChild(postElement);
			});
			
			console.log('Posts added to DOM:', currentPosts.slice(0, blockData.postsToShow).length);
		} else if (postWrapper && currentPosts.length === 0) {
			console.log('No posts to display, clearing wrapper');
			postWrapper.innerHTML = '<p>No posts found for this category.</p>';
		}
	}, [currentPosts, blockData.postsToShow, blockElement]);

	if (loading) {
		return <div>Loading posts...</div>;
	}

	return null; // This component only handles JavaScript, not rendering
}

// Vanilla JavaScript fallback for tab functionality
function initializeVanillaTabs(block, blockData) {
	console.log('Initializing vanilla JavaScript tabs for block');
	
	let activeTab = blockData.activeTab || (blockData.selectedCategories.length > 0 ? blockData.selectedCategories[0].id : null);
	let categoryPosts = {};
	let currentPosts = [];
	
	// Fetch posts for all categories
	const fetchPromises = blockData.selectedCategories.map(category => 
		fetch(`/wp-json/wp/v2/posts?categories=${category.id}&per_page=24&_embed`)
			.then(response => response.json())
	);
	
	Promise.all(fetchPromises)
		.then((responses) => {
			responses.forEach((res, index) => {
				const catId = blockData.selectedCategories[index].id;
				categoryPosts[catId] = res;
			});
			
			// Set initial posts
			if (activeTab && categoryPosts[activeTab]) {
				currentPosts = categoryPosts[activeTab];
				updatePostsDisplay(block, currentPosts, blockData.postsToShow);
			}
			
			// Add click event listeners to tabs
			const tabs = block.querySelectorAll('.category-tab');
			tabs.forEach(tab => {
				tab.addEventListener('click', (e) => {
					const categoryId = parseInt(e.target.getAttribute('data-category-id'));
					handleTabClick(categoryId);
				});
			});
			
			console.log('Vanilla tabs initialized successfully');
		})
		.catch((err) => {
			console.error('Error fetching posts in vanilla mode:', err);
		});
	
	function handleTabClick(categoryId) {
		console.log('Vanilla handleTabClick - categoryId:', categoryId);
		activeTab = categoryId;
		
		// Update tab styling
		const tabs = block.querySelectorAll('.category-tab');
		tabs.forEach(tab => {
			const tabCategoryId = parseInt(tab.getAttribute('data-category-id'));
			if (tabCategoryId === activeTab) {
				tab.classList.add('active');
			} else {
				tab.classList.remove('active');
			}
		});
		
		// Update posts
		if (categoryPosts[categoryId]) {
			currentPosts = categoryPosts[categoryId];
			updatePostsDisplay(block, currentPosts, blockData.postsToShow);
			console.log('Switched to category posts:', currentPosts.length);
		}
	}
	
	function updatePostsDisplay(block, posts, postsToShow) {
		const postWrapper = block.querySelector('.post-wrapper');
		if (postWrapper && posts.length > 0) {
			// Clear existing posts
			postWrapper.innerHTML = '';
			
			// Add new posts with proper structure matching edit.js
			posts.slice(0, postsToShow).forEach((post, index) => {
				const postElement = document.createElement('div');
				postElement.setAttribute('data-post-serial', index);
				postElement.className = 'newsly__post_card bg-slate-200 p-4 rounded hover:bg-slate-300 transition-all';
				
				// Get categories for this post
				const categories = post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0] 
					? post._embedded['wp:term'][0] 
					: [];
				
				// Get featured image
				const featuredImage = post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0] 
					? post._embedded['wp:featuredmedia'][0] 
					: null;
				
				// Create the exact structure from edit.js
				postElement.innerHTML = `
					${featuredImage ? `
						<div class="mb-4">
							<img class="inline-block w-full rounded" src="${featuredImage.source_url}" alt="${post.title.rendered}">
						</div>
					` : ''}
					${categories.length > 0 ? `
						<div class="mb-3">
							${categories.map(category => `
								<a href="${category.link}" class="inline-block no-underline text-xs text-slate-600 bg-slate-100 hover:bg-slate-400 hover:text-white capitalize p-1 mr-1 rounded-md transition-all" style="margin-right: 10px;">${category.name}</a>
							`).join('')}
						</div>
					` : ''}
					<a href="${post.link}" class="inline-block w-full no-underline font-poppins text-xl text-slate-900 hover:text-slate-600 transition font-medium mb-2">
						<h3>${post.title.rendered}</h3>
					</a>
					<div class="font-poppins text-slate-900 mt-2">
						${post.excerpt.rendered}
					</div>
				`;
				postWrapper.appendChild(postElement);
			});
			
			console.log('Posts updated in vanilla mode:', posts.slice(0, postsToShow).length);
		}
	}
}

// Initialize the frontend functionality
document.addEventListener('DOMContentLoaded', function() {
	console.log('DOM Content Loaded - Initializing category post blocks');
	
	const categoryPostBlocks = document.querySelectorAll('.gts__category_post');
	console.log('Found category post blocks:', categoryPostBlocks.length);
	
	categoryPostBlocks.forEach((block, index) => {
		console.log(`Processing block ${index + 1}:`, block);
		
		// Get block data from data attributes
		const categoriesAttr = block.getAttribute('data-categories');
		const activeTabAttr = block.getAttribute('data-active-tab');
		const postsToShowAttr = block.getAttribute('data-posts-to-show');
		const postColumnAttr = block.getAttribute('data-post-column');
		
		console.log('Block attributes:', {
			categories: categoriesAttr,
			activeTab: activeTabAttr,
			postsToShow: postsToShowAttr,
			postColumn: postColumnAttr
		});
		
		const blockData = {
			selectedCategories: categoriesAttr ? JSON.parse(categoriesAttr) : [],
			activeTab: activeTabAttr ? parseInt(activeTabAttr) : null,
			postsToShow: postsToShowAttr ? parseInt(postsToShowAttr) : 3,
			postColumn: postColumnAttr ? parseInt(postColumnAttr) : 3
		};
		
		console.log('Parsed block data:', blockData);
		
		if (blockData.selectedCategories.length === 0) {
			console.log('No categories found, skipping block');
			return;
		}
		
		// Create a container for React
		const container = document.createElement('div');
		container.style.display = 'none'; // Hide the React container
		block.appendChild(container);
		
		// Initialize React component
		try {
			const root = createRoot(container);
			root.render(<CategoryPostFrontend blockData={blockData} blockElement={block} />);
			console.log('React component initialized for block', index + 1);
		} catch (error) {
			console.error('Error initializing React component:', error);
			// Fallback: Initialize with vanilla JavaScript
			initializeVanillaTabs(block, blockData);
		}
	});
});
