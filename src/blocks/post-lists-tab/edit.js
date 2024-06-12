import React from 'react';
import { useSelect, withSelect, select } from '@wordpress/data';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import GetFeaturedImage from './getFeaturedImage';
// import SidebarControl from './sidebarControl';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

import RenderPostCategoryData from './components';
import { Disabled } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function edit(props) {
	const blockProps = useBlockProps();
	console.log('props before fetch', props);

	const { attributes, setAttributes } = props;
	const [isLoading, setIsLoading] = useState(false);
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
				let catArr = [];
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
	 * Load posts
	 */
	useEffect(() => {
		setIsLoading(true);
		apiFetch({
			path: `/wp/v2/posts/`,
		})
			.then((res) => {
				setAttributes({
					fetchedPosts: res,
				});
				setIsLoading(false);
			})
			.catch((err) => console.log('err', err));
	}, []);
	console.log('props after fetch', props);
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
				 */
				setAttributes({
					fetchedPosts: [res[0]],
				});
				res.map((res) => {
					catPostsArr.push({
						label: res.title.rendered,
						value: res.id,
					});
				});
				setAttributes({
					selectedCategoryPosts: catPostsArr,
				});
			})
			.catch((err) => console.log(err));
	};
	/**
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
		setAttributes({
			selectedCategroyId: selectedCat,
		});
		handlePostsByCategory(selectedCat);
	};
	/**
	 * fetch category
	 * specific posts
	 * no use of this function
	 * ------------------------
	 */
	const getPosts = useSelect(
		(select) => {
			/**
			 * if no selected category id
			 * return
			 */
			if (!attributes.selectedCategroyId) {
				return;
			}
			/**
			 * If selected category id available
			 * then fetch specific category post
			 */
			let getSelectedPosts = select('core').getEntityRecords(
				'postType',
				'post',
				{
					categories: [attributes.selectedCategroyId],
				}
			);
			/**
			 * if no data found
			 * return
			 */
			if (null == getSelectedPosts) {
				return;
			}
			return getSelectedPosts;
		},
		[attributes.selectedCategroyId]
	);
	/**
	 * fetch posts by id
	 * and then assign
	 * fetchedPosts attribute
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
				{/* {attributes.showFeaturedImage &&
					postData.featured_media !== 0 && (
						<GetFeaturedImage postId={postData.featured_media} />
					)} */}
				{/* 
                If user want to show featured image
                but post have no featured image
                */}
				{attributes.showFeaturedImage &&
					postData.featured_media == 0 && (
						<div>
							{__(
								'No featured image found',
								'anam-gutenberg-starter'
							)}
						</div>
					)}
				{/* 
                Toggle category display
                */}
				{/* {attributes.showCategory && (
					<RenderPostCategoryData
						catArr={postData.categories}
						parentProps={parentProps}
					/>
				)} */}
				{/* 
                disabled click inside editor
                */}
				<Disabled>
					<h3>
						<a href={postData.link}>{postData.title.rendered}</a>
					</h3>
				</Disabled>
				{/* 
                excerpt of the post
                */}
				{attributes.showExcerpt && (
					<RichText tagName="p" value={postData.excerpt.rendered} />
				)}
			</div>
		);
	};
	/**
	 * handle category display control
	 * in post card
	 */
	const handleCategoryToggleControl = () => {
		setAttributes({
			showCategory: !attributes.showCategory,
		});
	};
	/**
	 * handle excerpt display control
	 * in post card
	 */
	const handleExcerptToggleControl = () => {
		setAttributes({
			showExcerpt: !attributes.showExcerpt,
		});
	};

	const handleFeaturedImageToggleControl = () => {
		setAttributes({
			showFeaturedImage: !attributes.showFeaturedImage,
		});
	};

	return (
		<div {...blockProps}>
			{/* <SidebarControl
				props={props}
				categories={attributes.categories}
				handleCategoryChange={handleCategoryChange}
				handleSelectedPostData={handleSelectedPostData}
				handleCategoryToggleControl={handleCategoryToggleControl}
				handleExcerptToggleControl={handleExcerptToggleControl}
				handleFeaturedImageToggleControl={
					handleFeaturedImageToggleControl
				}
			/> */}
			{/* <ServerSideRender
                block="anam-gutenberg-starter-block/single-post"
            /> */}
			<nav>
				{attributes.categories.length > 0 &&
					attributes.categories.map((cat, index) => {
						return (
							<a
								style={{ margin: '0px 10px' }}
								href="#"
								key={index}
							>
								{cat.label}
							</a>
						);
					})}
			</nav>
			<div className="post-lists">
				{isLoading ? <p>Loading...</p> : null}
				{attributes.fetchedPosts.length > 0 &&
					attributes.fetchedPosts.map((post, index) => {
						return (
							<div
								key={index}
								style={{
									border: 'solid 1px',
									marginBottom: '30px',
								}}
							>
								{attributes.showFeaturedImage &&
									post.featured_media !== 0 && (
										<GetFeaturedImage
											postId={post.featured_media}
										/>
									)}
								<h3>{post.title.rendered}</h3>
								{attributes.showCategory && (
									<RenderPostCategoryData
										catArr={post.categories}
										// parentProps={parentProps}
									/>
								)}
								<div
									dangerouslySetInnerHTML={{
										__html: post.excerpt.rendered,
									}}
								/>
							</div>
						);
					})}
			</div>

			{/* {attributes.fetchedPosts.length == 0 && (
				<FallbackMessage message="Please select a post to display" />
			)} */}

			{/* {!attributes.selectedPostId &&
				attributes.categories.length > 0 &&
				attributes.fetchedPosts.length > 0 && (
					<PostCard
						data={attributes.fetchedPosts[0]}
						parent={props}
					/>
				)}
			{attributes.selectedPostId &&
				attributes.fetchedPosts.length > 0 && (
					<PostCard
						data={attributes.fetchedPosts[0]}
						parent={props}
					/>
				)} */}
			{/* {
                !attributes.selectedCategroyId && <p>Select a category first.</p>
            }
            { ! getPosts && 'Loading' }
            { getPosts && getPosts.length === 0 && 'No Posts' }
            { getPosts && getPosts.length > 0 && 
                getPosts.map(singlePost => {
                    return(
                        <p>
                            <GetFeaturedImage
                                postId={singlePost.featured_media}
                            />
                            <a href={ singlePost.link }>
                                { singlePost.title.rendered }
                            </a>
                        </p>
                    )
                })
            } */}
		</div>
	);
}
