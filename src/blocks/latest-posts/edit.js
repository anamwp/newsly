import { __ } from '@wordpress/i18n';
import React from 'react';
import { useBlockProps } from '@wordpress/block-editor';
import SidebarControl from './sidebarControl';
import { useState, useEffect, useRef } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import GSPostCardOverlay from '../components/GSPostCardOverlay';

/**
 * Fallback message shown before any posts are available.
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
		className: 'newsly_block__latest_posts',
	});
	const { attributes, setAttributes } = props;
	/**
	 * Fetch first 10 categoris from REST API
	 * at first loading
	 */
	useEffect(() => {
		attributes.categories.length === 0 &&
			apiFetch({ path: '/wp/v2/categories' }).then((cat) => {
				let catArr = [
					{
						label: 'Select a category',
						value: '',
					},
				];
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
	}, [attributes.categories.length]);
	/**
	 * Fetched first 10 posts
	 */
	useEffect(() => {
		if (
			!attributes.selectedCategroyId ||
			attributes.selectedCategroyId === ''
		) {
			const stickyParam = attributes.ignoreStickyPosts
				? '&sticky=false'
				: '';
			apiFetch({
				path: `/wp/v2/posts?_embed&per_page=10${stickyParam}`,
			}).then((res) => {
				setAttributes({
					fetchedPosts: res,
				});
			});
		}
	}, [attributes.selectedCategroyId, attributes.ignoreStickyPosts]);

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
		const stickyParam = attributes.ignoreStickyPosts ? '&sticky=false' : '';
		apiFetch({
			path: `/wp/v2/posts?categories=${catId}&_embed${stickyParam}`,
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

	const handleIgnoreStickyPostsToggleControl = () => {
		setAttributes({
			ignoreStickyPosts: !attributes.ignoreStickyPosts,
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
				handleIgnoreStickyPostsToggleControl={
					handleIgnoreStickyPostsToggleControl
				}
			/>
			{/* Show fallback message before category choosen */}
			{attributes.fetchedPosts.length == 0 && (
				<FallbackMessage message="Please select a post to display" />
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
