import { __ } from '@wordpress/i18n';
import React from 'react';
import { useBlockProps } from '@wordpress/block-editor';
import SidebarControl from './sidebarControl';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import GSPostCard from '../components/GSPostCard';

export default function edit(props) {
	const blockProps = useBlockProps({
		className: 'gts_block__single_post',
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
	}, []);
	/**
	 * Set posts while change the category
	 * @param {*} selectedCatId
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
			path: `/wp/v2/posts?categories=${catId}&_embed`,
		})
			.then((res) => {
				let catPostsArr = [];
				/**
				 * set response first data
				 * to fetchPosts attribute
				 * and set [selectedPostId] from the first ID of the fetched post
				 */
				setAttributes({
					fetchedPosts: [res[0]],
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
	 * Fire this function on chnage of posts selection from the sidebar control panel
	 * Its main function is to Fetch posts by id
	 * and then assign data to [fetchedPosts] attribute
	 *
	 * @param {*} newPostId
	 * @returns
	 */
	const handleSelectedPostData = (newPostId) => {
		let selectedPostId = newPostId ? newPostId : attributes.selectedPostId;
		/**
		 * set the new post ID
		 * to selectedPostId attribute
		 */
		if (newPostId) {
			setAttributes({
				selectedPostId: newPostId,
			});
		}
		/**
		 * if there is no
		 * selectedPostId
		 * then return
		 */
		if (!selectedPostId) {
			return;
		}
		/**
		 * fetch data from rest point
		 */
		apiFetch({
			path: `/wp/v2/posts/?include=${selectedPostId}&_embed`,
		})
			.then((res) => {
				setAttributes({
					fetchedPosts: res,
				});
			})
			.catch((err) => console.log('err', err));
	};
	/**
	 * Fallback message
	 * @param {*} props
	 * @returns
	 */
	const FallbackMessage = (props) => {
		return <p>{props.message}</p>;
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
				handleCategoryChange={handleCategoryChange}
				handleSelectedPostData={handleSelectedPostData}
				handleCategoryToggleControl={handleCategoryToggleControl}
				handleExcerptToggleControl={handleExcerptToggleControl}
				handleFeaturedImageToggleControl={
					handleFeaturedImageToggleControl
				}
			/>
			{/* Show fallback message before category choosen */}
			{attributes.fetchedPosts.length == 0 && (
				<FallbackMessage message="Please select a post to display" />
			)}
			{/* show to first post from the choosen category listed post */}
			{attributes.selectedPostId &&
				attributes.fetchedPosts.length > 0 && (
					<GSPostCard
						data={attributes.fetchedPosts[0]}
						parent={props}
					/>
				)}
		</div>
	);
}
