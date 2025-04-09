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
	const blockProps = useBlockProps({
		className: 'gts__category-post',
	});
	console.log('edit props', props.attributes);

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
	 * Manage number of posts to show
	 * @param {number} postNumber
	 */
	const handleNumberofPoststoShow = (postNumber) => {
		setAttributes({
			postsToShow: postNumber,
		});
	};
	/**
	 * Manage number of posts to show
	 * @param {number} postNumber
	 */
	const handleNumberofPostsColumn = (column) => {
		setAttributes({
			postColumn: column,
		});
	};
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
					// fetchedPosts: [res[0]],
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
		 * Get category name
		 *
		 */
		const selectedCatOption = attributes.categories.find(
			(option) => option.value === parseInt(selectedCat)
		);
		// console.log('selectedCatOption', selectedCatOption);
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
		console.log('postData', postData);
		let parentProps = props.parent;
		const featuredImage =
			postData._embedded['wp:featuredmedia']?.[0]?.source_url;

		const categories = postData._embedded['wp:term']?.[0] || [];
		console.log(featuredImage, categories);

		return (
			<div className="category-post-card bg-slate-200 p-4 rounded">
				{/* 
                if user want to show featured image 
                and post have featured image
                */}
				{parentProps.attributes.showFeaturedImage &&
					postData.featured_media !== 0 && (
						<div className="mb-2">
							<img
								className="inline-block w-full rounded"
								src={featuredImage}
								alt=""
							/>
						</div>
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
					{parentProps.attributes.showCategory &&
						categories &&
						categories.map((singleCat) => {
							return (
								<a
									href={singleCat.link}
									style={{ marginRight: '10px' }}
									className="inline-block no-underline text-xs text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-300 capitalize p-1 mr-1 rounded-md transition-all"
								>
									{singleCat.name}
								</a>
							);
						})}
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
				handleNumberofPoststoShow={handleNumberofPoststoShow}
				handleNumberofPostsColumn={handleNumberofPostsColumn}
				handleCategoryToggleControl={handleCategoryToggleControl}
				handleExcerptToggleControl={handleExcerptToggleControl}
				handleFeaturedImageToggleControl={
					handleFeaturedImageToggleControl
				}
			/>
			{/* <ServerSideRender
                block="anam-gutenberg-starter-block/category-post"
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
			<div className="cat-label">
				{attributes.selectedCategroyName && (
					<p className="text-xl font-semibold capitalize mb-5">
						{attributes.selectedCategroyName}
					</p>
				)}
			</div>
			<div
				className={`post-wrapper grid gs-cols-${attributes.postColumn}`}
			>
				{attributes.selectedPostId &&
					attributes.fetchedPosts.length > 0 &&
					attributes.fetchedPosts[0]
						.slice(0, attributes.postsToShow)
						.map((post) => <PostCard data={post} parent={props} />)}
			</div>
		</div>
	);
}
