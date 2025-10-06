import { __ } from '@wordpress/i18n';
import React from 'react';
import { useBlockProps } from '@wordpress/block-editor';
import SidebarControl from './sidebarControl';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import GSPostCard from '../components/GSPostCard';

export default function edit(props) {
	/**
	 * Extract attributes and setAttributes from props.
	 */
	const { attributes, setAttributes } = props;
	/**
	 * Add classname to block props.
	 */
	const gridClass =
		attributes.layout === 'grid' ? `grid-${attributes.postColumn}` : '';
	const blockProps = useBlockProps({
		className: `newsly__category_post gs-cols-${attributes.postColumn} ${gridClass}`,
	});
	/**
	 * Fetch all categoris at first loading.
	 */
	useEffect(() => {
		attributes.categories.length === 0 &&
			apiFetch({
				path: '/wp/v2/categories?per_page=100&orderby=count&order=desc',
			}).then((cat) => {
				let catArr = [];
				cat.map((cat) => {
					catArr.push({
						label: cat.name,
						value: cat.id.toString(),
					});
				});
				setAttributes({
					categories: catArr,
				});
			});
	}, []);

	/**
	 * Ensure first category is active when selectedCategories are available
	 */
	useEffect(() => {
		if (attributes.selectedCategories.length > 0 && !attributes.activeTab) {
			console.log('Setting first category as active on load:', attributes.selectedCategories[0].id);
			// If we have stored category data, use it; otherwise trigger a fetch
			if (attributes.fetchedPostCategoryData && attributes.fetchedPostCategoryData[attributes.selectedCategories[0].id]) {
				const firstCategoryPosts = attributes.fetchedPostCategoryData[attributes.selectedCategories[0].id];
				console.log('Using stored posts for first category:', firstCategoryPosts.length);
				setAttributes({
					activeTab: attributes.selectedCategories[0].id,
					fetchedPosts: [firstCategoryPosts],
					selectedPostId: firstCategoryPosts.length > 0 ? firstCategoryPosts[0].id : null,
				});
			} else {
				// If no stored data, just set the active tab and let the existing fetch handle posts
				setAttributes({
					activeTab: attributes.selectedCategories[0].id,
				});
			}
		}
	}, [attributes.selectedCategories, attributes.fetchedPostCategoryData]);
	/**
	 * Manage number of posts to show.
	 * @param {number} postNumber
	 */
	const handleNumberofPoststoShow = (postNumber) => {
		setAttributes({
			postsToShow: postNumber,
		});
	};
	/**
	 * Manage number of column to show.
	 * @param {number} postNumber
	 */
	const handleNumberofPostsColumn = (column) => {
		setAttributes({
			postColumn: column,
		});
	};
	/**
	 * Set posts while change the category
	 * Fetch posts for all selected categories and store them separately
	 * @param {*} selectedCatIds - Array of Category IDs
	 */
	const handlePostsByCategory = (
		selectedCatIds = attributes.selectedCategroyId
	) => {
		/**
		 * if nothing passed or empty array
		 * then reset all data
		 */

		if (!selectedCatIds || selectedCatIds.length === 0) {
			setAttributes({
				selectedCategories: [],
				fetchedPosts: [],
				selectedPostId: null,
				activeTab: null,
			});
			return;
		}
		console.log('selectedCatIds', selectedCatIds);
		
		/**
		 * Fetch posts for all selected categories
		 * Store them in an object with category ID as key
		 */
		const fetchPromises = selectedCatIds.map(catId => 
			apiFetch({
				path: `/wp/v2/posts?categories=${catId}&per_page=24&_embed`,
			})
		);
		
		Promise.all(fetchPromises)
			.then((responses) => {
				const categoryPostsData = {};
				let firstCategoryPosts = [];
				
				responses.forEach((res, index) => {
					const catId = selectedCatIds[index];
					// Store as both string and number keys to avoid type issues
					categoryPostsData[catId] = res;
					categoryPostsData[String(catId)] = res;
					categoryPostsData[Number(catId)] = res;
					// console.log(`Storing posts for category ${catId}:`, res.length, 'posts');
					console.log('categoryPostsData', categoryPostsData);
					
					// Set first category posts as default
					if (index === 0) {
						firstCategoryPosts = res;
					}
				});
				
				// console.log('Final categoryPostsData:', categoryPostsData);
				
				/**
				 * Update attributes with all category posts data
				 * Set first category as active by default
				 */
				// console.log('Setting first category as active:', selectedCatIds[0]);
				// console.log('First category posts:', firstCategoryPosts.length, 'posts');
				
				setAttributes({
					fetchedPosts: [firstCategoryPosts],
					selectedPostId: firstCategoryPosts.length > 0 ? firstCategoryPosts[0].id : null,
					activeTab: selectedCatIds[0],
					allCategoryPosts: categoryPostsData,
				});
			})
			.catch((err) => console.log(err));
	};
	/**
	 * Fire this function on change of the category selection from the sidebar control panel
	 * handle category change
	 * @param {*} selectedCategoryIds - Array of selected category IDs
	 */
	const handleCategoryChange = (selectedCategoryIds) => {
		console.log('selectedCategoryIds', selectedCategoryIds);
		// debugger;
		// Convert selected IDs to category objects with id and label
		const selectedCategories = selectedCategoryIds.map(catId => {
			// console.log('catId', catId);
			// console.log('catId', typeof catId);
			// console.log('attributes.categories', attributes.categories);
			const category = attributes.categories.find(cat => Number(cat.value) === Number(catId));
			// console.log('category', category);
			return {
				id: Number(catId),
				label: category ? category.label : 'Unknown Category'
			};
		});
		/**
		 * Update both [selectedCategroyId] and [selectedCategories] attributes.
		 */
		setAttributes({
			selectedCategroyId: selectedCategoryIds || [],
			selectedCategories: selectedCategories || [],
		});
		// debugger;
		
		/**
		 * Update dropdown list posts based on category selections
		 * Update attribute [selectedCategoryPosts] value for the new posts
		 */
		handlePostsByCategory(selectedCategoryIds || []);
	};
	
	/**
	 * Handle tab click to switch between categories
	 * @param {number} categoryId - The ID of the category to switch to
	 */
	const handleTabClick = (categoryId) => {
		// Get posts for the selected category from stored data
		const categoryPosts = attributes.allCategoryPosts?.[categoryId] || [];
		
		// Update active tab and display posts for selected category
		setAttributes({
			activeTab: categoryId,
			fetchedPosts: [categoryPosts],
			selectedPostId: categoryPosts.length > 0 ? categoryPosts[0].id : null,
		});
	};
	/**
	 * Fallback message
	 * @param {string} props
	 * @returns HTML
	 */
	const FallbackMessage = (props) => {
		return <p>{props.message}</p>;
	};
	/**
	 * Show featured image based on the selection for sidebar panel
	 * for the post card
	 * and update [showFeaturedImage] value
	 */
	const handleFeaturedImageToggleControl = () => {
		setAttributes({
			showFeaturedImage: !attributes.showFeaturedImage,
		});
	};
	/**
	 * Show Category based on the selection for sidebar panel
	 * for the post card
	 * and update [showCategory] value
	 */
	const handleCategoryToggleControl = () => {
		setAttributes({
			showCategory: !attributes.showCategory,
		});
	};
	/**
	 * Show excerpt based on the selection for sidebar panel
	 * for the post card
	 * and update [showExcerpt] value
	 */
	const handleExcerptToggleControl = () => {
		setAttributes({
			showExcerpt: !attributes.showExcerpt,
		});
	};
	const handleFeaturedExcerptToggleControl = () => {
		setAttributes({
			showFeaturedExcerpt: !attributes.showFeaturedExcerpt,
		});
	};
	console.log('attributes', attributes);
	console.log('attributes.allCategoryPosts', attributes.allCategoryPosts);
	return (
		<div {...blockProps}>
			<SidebarControl
				props={props}
				categories={attributes.categories}
				handleCategoryChange={handleCategoryChange}
				handleNumberofPoststoShow={handleNumberofPoststoShow}
				handleNumberofPostsColumn={handleNumberofPostsColumn}
				handleCategoryToggleControl={handleCategoryToggleControl}
				handleExcerptToggleControl={handleExcerptToggleControl}
				handleFeaturedExcerptToggleControl={
					handleFeaturedExcerptToggleControl
				}
				handleFeaturedImageToggleControl={
					handleFeaturedImageToggleControl
				}
			/>
			{/* Fallback message */}
			{attributes.fetchedPosts.length == 0 && (
				<FallbackMessage message="Please select one or more categories to display posts" />
			)}
			{/* Show the category names as tabs. */}
			<div className="cat-label">
				{attributes.selectedCategories.length > 0 && (
					<p className="text-xl font-semibold capitalize mb-5">
						{attributes.selectedCategories.length === 1 
							? attributes.selectedCategories[0].label
							: `${attributes.selectedCategories.length} Categories Selected`
						}
					</p>
				)}
				{/* Show all categories as tabs */}
				{attributes.selectedCategories.length > 0 && (
					<div className="border-b border-gray-200 mb-6">
										<nav role="tablist" aria-label="Category tabs">
											<ul className="-mb-px flex space-x-8">
							{attributes.selectedCategories.map((category) => {
								const isActive = attributes.activeTab === category.id;
								return (
									<li role="presentation" key={category.id}>
									<button
										role="tab"
										aria-controls={`category-tab-content-${category.id}`}
										aria-selected={isActive}
										id={`category-tab-${category.id}`}
												className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
													isActive
														? 'border-blue-500 text-blue-600'
														: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
												}`}
												tabindex="0"
												onClick={() => handleTabClick(category.id)}
									>
										{category.label}
									</button>
									</li>
								);
							})}
							</ul>
						</nav>
					</div>
				)}
			</div>
			{/* Show posts from all categories, but hide inactive ones */}
				<div
					className={`post-wrapper`}
					aria-live="polite"
					aria-atomic="true"
				>
				{
					typeof attributes.allCategoryPosts === 'object' && Object.keys(attributes.allCategoryPosts).length > 0 && (
						Object.entries(attributes.allCategoryPosts).map(([catID, post], index) => {
							return (
								<div 
								key={index} 
								className={`tab-content ${ Number(catID) === Number(attributes.activeTab) ? 'active grid' : 'hidden' } gs-cols-${attributes.postColumn} gap-5`} 
								id={`category-tab-content-${catID}`}
								role="tabpanel"
								aria-labelledby={`category-tab-${catID}`}
												aria-hidden={Number(catID) === Number(attributes.activeTab) ? 'false' : 'true'}
												aria-expanded={Number(catID) === Number(attributes.activeTab) ? 'true' : 'false'}
								>
									{post.slice(0, attributes.postsToShow).map((post, index) => {
										return <GSPostCard 
										key={index} 
										data={post} 
										parent={props} 
										/>;
									})}
								</div>
							);
						})
					)
				}
			</div>
		</div>
	);
}
