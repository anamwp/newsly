import { __ } from '@wordpress/i18n';
import React from 'react';
import { useBlockProps } from '@wordpress/block-editor';
import SidebarControl from './sidebarControl';
import { useState, useEffect, useRef } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import GSPostCardOverlay from '../components/GSPostCardOverlay';

/**
 * Fallback message shown before any sticky/category posts are available.
 * Hoisted out of `edit` so it keeps a stable identity across renders.
 * @param {Object} props
 * @param {string} props.message
 * @returns {JSX.Element}
 */
function FallbackMessage({ message }) {
	return <p>{message}</p>;
}

export default function edit(props) {
	const blockProps = useBlockProps({
		className: 'newsly_block__featured_posts',
	});
	const { attributes, setAttributes } = props;
	/**
	 * Fetch only the categories that have at least one sticky post,
	 * so the picker doesn't offer categories with nothing to show.
	 */
	useEffect(() => {
		if (attributes.categories.length !== 0) {
			return;
		}
		apiFetch({
			path: '/wp/v2/posts?sticky=true&per_page=100&_fields=categories',
		}).then((stickyPosts) => {
			const categoryIds = [
				...new Set(stickyPosts.flatMap((post) => post.categories)),
			];
			const catArr = [
				{
					label: 'Select a category',
					value: '',
				},
			];
			if (categoryIds.length === 0) {
				setAttributes({ categories: catArr });
				return;
			}
			apiFetch({
				path: `/wp/v2/categories?include=${categoryIds.join(
					',',
				)}&per_page=100`,
			}).then((cat) => {
				cat.map((cat) => {
					catArr.push({
						label: cat.name,
						value: cat.id,
					});
				});
				setAttributes({
					categories: catArr,
				});
			});
		});
	}, [attributes.categories.length]);
	/**
	 * Fetched first 10 posts
	 */
	useEffect(() => {
		if (
			!attributes.selectedCategroyId ||
			attributes.selectedCategroyId === ''
		) {
			apiFetch({
				path: `/wp/v2/posts?_embed&per_page=10&sticky=true`,
			}).then((res) => {
				setAttributes({
					fetchedPosts: res,
				});
			});
		}
	}, [attributes.selectedCategroyId]);

	const handleNumberOfPostsChange = (
		numberOfPosts = attributes.numberOfPosts,
	) => {
		setAttributes({
			numberOfPosts: numberOfPosts,
		});
	};

	/**
	 * Tracks the most recent handlePostsByCategory call so that a slower,
	 * older request can't overwrite state set by a newer one.
	 */
	const latestPostsRequestIdRef = useRef(0);

	/**
	 * Set posts while change the category
	 * @param {*} catId
	 */
	const handlePostsByCategory = (catId) => {
		const requestId = ++latestPostsRequestIdRef.current;

		/**
		 * fetch the data
		 * from restapi endpoint
		 * for specific category
		 */
		apiFetch({
			path: `/wp/v2/posts?categories=${catId}&_embed&sticky=true`,
		})
			.then((res) => {
				// Ignore stale responses from a category change that's since been superseded.
				if (requestId !== latestPostsRequestIdRef.current) {
					return;
				}

				let catPostsArr = [];
				/**
				 * set response first data
				 * to fetchPosts attribute
				 * and set [selectedPostId] from the first ID of the fetched post
				 */
				setAttributes({
					fetchedPosts: res,
				});
				/**
				 * Update the dropdown list
				 * based on category selection
				 */
				res.map((res) => {
					catPostsArr.push({
						label: res.title.rendered,
						value: res.id,
					});
				});
				/**
				 * Update Attrbutes [selectedCategoryPosts]
				 */
				setAttributes({
					selectedCategoryPosts: catPostsArr,
				});
			})
			.catch((err) => console.error(err));
	};
	/**
	 * Fire this function on change of the category selection from the sidebar control panel
	 * handle category change
	 * @param {*} selectedCat
	 */
	const handleCategoryChange = (selectedCat) => {
		/**
		 * if no value passed
		 * then reset all data
		 */
		if (!selectedCat) {
			setAttributes({
				selectedCategroyId: '',
				selectedCategoryPosts: [],
				fetchedPosts: [],
			});
			return;
		}
		/**
		 * Update [selectedCategroyId] attribute for the selected category.
		 */
		setAttributes({
			selectedCategroyId: selectedCat,
		});
		/**
		 * Update dropdown list posts based on category selections
		 * Update attribute [selectedCategoryPosts] value for the new posts
		 */
		handlePostsByCategory(selectedCat);
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

	return (
		<div {...blockProps}>
			<SidebarControl
				props={props}
				categories={attributes.categories}
				handleNumberOfPostsChange={handleNumberOfPostsChange}
				handleCategoryChange={handleCategoryChange}
				handleCategoryToggleControl={handleCategoryToggleControl}
				handleExcerptToggleControl={handleExcerptToggleControl}
				handleFeaturedImageToggleControl={
					handleFeaturedImageToggleControl
				}
			/>
			{/* Show fallback message before category choosen */}
			{attributes.fetchedPosts.length == 0 && (
				<div role="alert" aria-live="polite" aria-atomic="true">
					<FallbackMessage message="No sticky posts found" />
				</div>
			)}
			{/* show to first post from the choosen category listed post */}
			{attributes.fetchedPosts &&
				attributes.fetchedPosts.length > 0 &&
				attributes.fetchedPosts
					.slice(0, attributes.numberOfPosts)
					.map((post) => (
						<GSPostCardOverlay
							key={post.id}
							data={post}
							parent={props}
						/>
					))}
		</div>
	);
}
