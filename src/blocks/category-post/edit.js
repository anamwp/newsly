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
		className: `gts__category_post gs-cols-${attributes.postColumn} ${gridClass}`,
	});
	/**
	 * Fetch all categoris at first loading.
	 */
	useEffect(() => {
		attributes.categories.length === 0 &&
			apiFetch({
				path: '/wp/v2/categories?per_page=100&orderby=count&order=desc',
			}).then((cat) => {
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
	 * Set posts while change the category
	 * Update dropdown list posts based on category selections
	 * @param {*} selectedCatId - Category ID
	 */
	const handlePostsByCategory = (
		selectedCatId = attributes.selectedCategroyId
	) => {
		/**
		 * if nothing passed
		 * then assing catId from
		 * attributes
		 */
		let catId = selectedCatId
			? selectedCatId
			: attributes.selectedCategroyId;
		/**
		 * fetch the data
		 * from restapi endpoint
		 * for specific category
		 */
		apiFetch({
			path: `/wp/v2/posts?categories=${catId}&per_page=24&_embed`,
		})
			.then((res) => {
				let catPostsArr = [];
				/**
				 * set response first data
				 * to fetchPosts attribute
				 * and set [selectedPostId] from the first ID of the fetched post
				 */
				setAttributes({
					fetchedPosts: [res],
					selectedPostId: res.length > 0 ? res[0].id : null,
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
			.catch((err) => console.log(err));
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
		 * Get the selected category option
		 */
		const selectedCatOption = attributes.categories.find(
			(option) => option.value === parseInt(selectedCat)
		);
		/**
		 * Update [selectedCategroyId] attribute for the selected category.
		 */
		setAttributes({
			selectedCategroyId: selectedCat,
			selectedCategroyName: selectedCatOption.label,
		});
		/**
		 * Update dropdown list posts based on category selections
		 * Update attribute [selectedCategoryPosts] value for the new posts
		 */
		handlePostsByCategory(selectedCat);
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
				<FallbackMessage message="Please select a category to display posts" />
			)}
			{/* Show the category name. */}
			<div className="cat-label">
				{attributes.selectedCategroyName && (
					<p className="text-xl font-semibold capitalize mb-5">
						{attributes.selectedCategroyName}
					</p>
				)}
			</div>
			{/* Show posts from the selected category. */}
			<div
				className={`post-wrapper grid gs-cols-${attributes.postColumn}`}
			>
				{attributes.selectedPostId &&
					attributes.fetchedPosts.length > 0 &&
					attributes.fetchedPosts[0]
						.slice(0, attributes.postsToShow)
						.map((post, index) => (
							<GSPostCard
								key={index}
								data={post}
								parent={props}
								numberKey={index}
							/>
						))}
			</div>
		</div>
	);
}
