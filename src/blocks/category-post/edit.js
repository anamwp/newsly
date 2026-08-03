import { __ } from '@wordpress/i18n';
import React from 'react';
import { useBlockProps } from '@wordpress/block-editor';
import SidebarControl from './sidebarControl';
import { useState, useEffect, useRef } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import GSPostCard from '../components/GSPostCard';

/**
 * Selecting many categories at once (e.g. shift-click a large range in the
 * sidebar's multi-select) fires one parallel REST request per category and
 * stores each category's full post list in the block's attributes. Beyond a
 * handful of categories this payload can grow large enough to be truncated
 * during save, corrupting the block's markup. Cap the selection instead of
 * letting it grow unbounded.
 */
const MAX_SELECTABLE_CATEGORIES = 10;

/**
 * Fallback message shown before any category is selected.
 * Hoisted out of `edit` so it keeps a stable identity across renders.
 * @param {Object} props
 * @param {string} props.message
 * @returns {JSX.Element}
 */
function FallbackMessage({ message }) {
	return <p>{message}</p>;
}

/**
 * Trims a full `/wp/v2/posts?...&_embed` response object down to only the
 * fields GSPostCard actually reads, before it gets persisted into block
 * attributes.
 *
 * The raw `_embed`'d response includes the full WP attachment object per
 * featured image (every registered image size, each with its own
 * width/height/filesize/mime_type/source_url/media_details/guid/etc.) and
 * full taxonomy term objects (_links, meta, description, ...) - none of
 * which GSPostCard uses. Storing that raw data in allCategoryPosts/
 * fetchedPosts bloats the block's serialized post_content; with a few
 * categories selected this routinely reaches several hundred KB, which can
 * get truncated somewhere in the save pipeline and corrupt the block's HTML
 * comment, causing Gutenberg's "Attempt Block Recovery" prompt on reload.
 *
 * @param {Object} post - a single raw post object from the REST API
 * @returns {Object} the trimmed post, same shape GSPostCard.js expects
 */
function slimPostForStorage(post) {
	const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
	const termGroups = post._embedded?.['wp:term'] || [];

	return {
		id: post.id,
		link: post.link,
		featured_media: post.featured_media,
		title: { rendered: post.title?.rendered ?? '' },
		excerpt: { rendered: post.excerpt?.rendered ?? '' },
		categories: post.categories,
		_embedded: {
			'wp:featuredmedia': featuredMedia
				? [
						{
							source_url: featuredMedia.source_url,
							alt_text: featuredMedia.alt_text,
						},
				  ]
				: [],
			'wp:term': termGroups.map((group) =>
				(group || []).map((term) => ({
					name: term.name,
					link: term.link,
				})),
			),
		},
	};
}

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
	 * Ensure first category is active when the block loads with
	 * previously saved selectedCategories but no activeTab yet.
	 * Runs once on mount only - once a category is chosen interactively,
	 * handleCategoryChange/handlePostsByCategory set activeTab directly.
	 */
	useEffect(() => {
		if (attributes.selectedCategories.length > 0 && !attributes.activeTab) {
			const firstCategoryId = attributes.selectedCategories[0].id;
			const storedPosts =
				attributes.fetchedPostCategoryData &&
				attributes.fetchedPostCategoryData[firstCategoryId];

			if (storedPosts) {
				setAttributes({
					activeTab: firstCategoryId,
					fetchedPosts: [storedPosts],
					selectedPostId: storedPosts.length > 0 ? storedPosts[0].id : null,
				});
			} else {
				// If no stored data, just set the active tab and let the existing fetch handle posts
				setAttributes({
					activeTab: firstCategoryId,
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
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
	 * Tracks the most recent handlePostsByCategory call so that a slower,
	 * older request can't overwrite state set by a newer one.
	 */
	const latestPostsRequestIdRef = useRef(0);

	/**
	 * True while the posts for the current category selection are being
	 * fetched, so the editor can show a loading message instead of stale or
	 * empty content.
	 */
	const [isFetchingPosts, setIsFetchingPosts] = useState(false);

	/**
	 * Set posts while change the category
	 * Fetch posts for all selected categories and store them separately
	 * @param {*} selectedCatIds - Array of Category IDs
	 */
	const handlePostsByCategory = (selectedCatIds) => {
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
				allCategoryPosts: {},
			});
			return;
		}

		const requestId = ++latestPostsRequestIdRef.current;
		setIsFetchingPosts(true);

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
				// Ignore stale responses from a category change that's since been superseded.
				if (requestId !== latestPostsRequestIdRef.current) {
					return;
				}

				const categoryPostsData = {};
				let firstCategoryPosts = [];

				responses.forEach((res, index) => {
					const catId = selectedCatIds[index];
					const slimmedPosts = res.map(slimPostForStorage);
					categoryPostsData[catId] = slimmedPosts;

					// Set first category posts as default
					if (index === 0) {
						firstCategoryPosts = slimmedPosts;
					}
				});

				/**
				 * Update attributes with all category posts data
				 * Set first category as active by default
				 */
				setAttributes({
					fetchedPosts: [firstCategoryPosts],
					selectedPostId: firstCategoryPosts.length > 0 ? firstCategoryPosts[0].id : null,
					// block.json declares activeTab as type "number" - must not
					// store the raw string category id here, or WordPress's
					// attribute validation silently discards it on reload
					// (falls back to the declared default: null), causing
					// "Attempt Block Recovery" even though the rest of the
					// block's stored markup is otherwise correct.
					activeTab: Number(selectedCatIds[0]),
					allCategoryPosts: categoryPostsData,
				});
				setIsFetchingPosts(false);
			})
			.catch((err) => {
				console.error(err);
				if (requestId === latestPostsRequestIdRef.current) {
					setIsFetchingPosts(false);
				}
			});
	};
	/**
	 * Fire this function on change of the category selection from the sidebar control panel
	 * handle category change
	 * @param {*} selectedCategoryIds - Array of selected category IDs
	 */
	const handleCategoryChange = (selectedCategoryIds) => {
		// Cap how many categories can be selected at once (e.g. a shift-click
		// range-select can otherwise select dozens at a time, firing that many
		// parallel fetches and bloating the block's stored attributes).
		if (selectedCategoryIds.length > MAX_SELECTABLE_CATEGORIES) {
			window.alert(
				`You can select up to ${MAX_SELECTABLE_CATEGORIES} categories at a time. Only the first ${MAX_SELECTABLE_CATEGORIES} of your selection will be used.`
			);
			selectedCategoryIds = selectedCategoryIds.slice(
				0,
				MAX_SELECTABLE_CATEGORIES
			);
		}

		// Build a lookup once instead of re-scanning attributes.categories for every id.
		const categoryByValue = new Map(
			attributes.categories.map((cat) => [Number(cat.value), cat])
		);

		// Convert selected IDs to category objects with id and label
		const selectedCategories = selectedCategoryIds.map(catId => {
			const category = categoryByValue.get(Number(catId));
			return {
				id: Number(catId),
				label: category ? category.label : 'Unknown Category'
			};
		});
		/**
		 * Update both [selectedCategroyId] and [selectedCategories] attributes.
		 */
		setAttributes({
			selectedCategroyId: selectedCategoryIds,
			selectedCategories,
		});

		/**
		 * Update dropdown list posts based on category selections
		 * Update attribute [selectedCategoryPosts] value for the new posts
		 */
		handlePostsByCategory(selectedCategoryIds);
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
				isFetchingPosts={isFetchingPosts}
			/>
			{/* Fallback message */}
			{!isFetchingPosts && attributes.fetchedPosts.length == 0 && (
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
								const isActive = Number(attributes.activeTab) === Number(category.id);
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
			<div className="post-wrapper-container relative">
				{isFetchingPosts && (
					<div
						role="status"
						aria-live="polite"
						className="absolute top-0 left-0 z-10 flex items-center gap-2 rounded-br bg-white/90 px-3 py-1.5 text-xs text-slate-700 shadow-sm"
					>
						<span
							className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"
							aria-hidden="true"
						></span>
						{__('Loading posts…', 'newsly')}
					</div>
				)}
				<div
					className={`post-wrapper`}
					aria-live="polite"
					aria-atomic="true"
				>
				{
					typeof attributes.allCategoryPosts === 'object' && Object.keys(attributes.allCategoryPosts).length > 0 && (
						Object.entries(attributes.allCategoryPosts).map(([catID, post], index) => {
							const isActivePanel = Number(catID) === Number(attributes.activeTab);
							return (
								<div
								key={index}
								className={`tab-content ${ isActivePanel ? 'active grid' : 'hidden' } gs-cols-${attributes.postColumn} gap-5`}
								id={`category-tab-content-${catID}`}
								role="tabpanel"
								aria-labelledby={`category-tab-${catID}`}
												aria-hidden={isActivePanel ? 'false' : 'true'}
												aria-expanded={isActivePanel ? 'true' : 'false'}
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
		</div>
	);
}
