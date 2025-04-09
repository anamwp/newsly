import { __ } from '@wordpress/i18n';
import React from 'react';
import { useSelect, withSelect, select } from '@wordpress/data';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import SidebarControl from './sidebarControl';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import GetFeaturedImage from './getFeaturedImage';
import RenderPostCategoryData from './components';
import { Disabled } from '@wordpress/components';

export default function edit(props) {
	const blockProps = useBlockProps();

	const { attributes, setAttributes } = props;
	const { getEntityRecords, getMedia } = select('core');
	const { getEditorSettings, getCurrentPost } = select('core/editor');
	// let __catDataa = getEntityRecords('taxonomy', 'category');
	/**
	 * fetch all categoris
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
	 * set posts while change the category
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
			path: `/wp/v2/posts?categories=${catId}`,
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
			path: `/wp/v2/posts/?include=${selectedPostId}`,
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
	const UpdateCatAttrCallback = (data) => {
		var catData = data;
		setAttributes({
			selectedPostCategory: catData,
		});
	};
	const SelectedPostFeaturedImage = (data) => {
		var featuredImageData = data;
		setAttributes({
			selectedPostFeaturedImage: featuredImageData,
		});
	};
	/**
	 * component to display post card
	 * @param {*} props
	 * @returns
	 * post card content
	 */
	const PostCard = (props) => {
		let postData = props.data;
		let parentProps = props.parent;
		return (
			<div className="single-post-card">
				{/* 
                if user want to show featured image 
                and post have featured image
                */}
				{parentProps.attributes.showFeaturedImage &&
					postData.featured_media !== 0 && (
						<GetFeaturedImage
							postId={postData.featured_media}
							selectedPostFeaturedImage={
								SelectedPostFeaturedImage
							}
						/>
					)}
				{/* 
                If user want to show featured image
                but post have no featured image
                */}
				{parentProps.attributes.showFeaturedImage &&
					postData.featured_media == 0 && (
						<div className="mb-2">
							{__(
								'No featured image found',
								'anam-gutenberg-starter'
							)}
						</div>
					)}
				{/* 
                Toggle category display
                */}
				<div className="mb-3">
					{parentProps.attributes.showCategory && (
						<RenderPostCategoryData
							catArr={postData.categories}
							parentProps={parentProps}
							updateCatAttrCallback={UpdateCatAttrCallback}
						/>
					)}
				</div>
				{/* 
                disabled click inside editor
                */}
				<Disabled>
					<a
						href={postData.link}
						className="inline-block w-full no-underline font-poppins text-xl text-slate-900 hover:text-slate-600 transition font-medium mb-2"
					>
						<h3>{postData.title.rendered}</h3>
					</a>
				</Disabled>
				{/* 
                excerpt of the post
                */}
				{/* <div>{postData.excerpt.rendered}</div> */}
				{parentProps.attributes.showExcerpt && (
					<div
						className="font-poppins text-slate-900 mt-2"
						dangerouslySetInnerHTML={{
							__html: postData.excerpt.rendered,
						}}
					/>
				)}
			</div>
		);
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
			{/* <ServerSideRender
                block="anam-gutenberg-starter-block/single-post"
            /> */}
			{attributes.fetchedPosts.length == 0 && (
				<FallbackMessage message="Please select a post to display" />
			)}

			{/* {!attributes.selectedPostId &&
				attributes.categories.length > 0 &&
				attributes.fetchedPosts.length > 0 && (
					<PostCard
						data={attributes.fetchedPosts[0]}
						parent={props}
					/>
				)} */}

			{/* show to first post from the choosen category listed post */}
			{attributes.selectedPostId &&
				attributes.fetchedPosts.length > 0 && (
					<PostCard
						data={attributes.fetchedPosts[0]}
						parent={props}
					/>
				)}
		</div>
	);
}
