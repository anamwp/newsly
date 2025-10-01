import React, { useState, useEffect } from 'react';
import { useSelect, withSelect, select } from '@wordpress/data';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import GetFeaturedImage from './getFeaturedImage';
import SidebarControl from './sidebarControl';
import { RawHTML, useRef } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

import RenderPostCategoryData from './components';
import { Disabled } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function edit(props) {
	const blockProps = useBlockProps();

	const { attributes, setAttributes } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [fetchPosts, setFetchPosts] = useState(attributes.fetchPosts || []);
	const { getEntityRecords, getMedia } = select('core');
	const { getEditorSettings, getCurrentPost } = select('core/editor');
	const [perPage, setPerPage] = useState(9); // default value is 9 and also need to be set in ajax call
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
						slug: cat.slug,
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
		// debugger;
		setIsLoading(true);
		//  if fetchPosts is empty, fetch all posts
		if (fetchPosts.length === 0) {
			debugger;
			apiFetch({
				path: `/wp/v2/posts?per_page=${perPage}`,
			})
				.then((res) => {
					setAttributes({
						fetchedPosts: res,
					});
					setIsLoading(false);
				})
				.catch((err) => console.log('errsss', err));
		}
	}, [fetchPosts]);

	console.log('attributes.fetchedPosts', attributes.fetchedPosts);

	/**
	 * fetch category specific posts
	 * no use of this function currently
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
								'newsly'
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
			<SidebarControl
				props={props}
				handleCategoryToggleControl={handleCategoryToggleControl}
				handleExcerptToggleControl={handleExcerptToggleControl}
				handleFeaturedImageToggleControl={
					handleFeaturedImageToggleControl
				}
			/>

			<nav className="tab mb-10 flex gap-2 p-4 pl-0">
				<a
					href=""
					className="active tablinks no-underline px-4 py-2 font-semibold transition-all text-sm bg-slate-800  bg-slate-50 text-white hover:bg-slate-800 hover:text-white border border-slate-100 rounded-md shadow-sm"
				>
					{__('All', 'newsly')}
				</a>
				{attributes.categories.length > 0 &&
					attributes.categories.map((cat, index) => {
						return (
							<a
								style={{ margin: '0px 10px' }}
								href="#"
								key={index}
								className="tablinks no-underline px-4 py-2 font-semibold text-sm transition-all rounded-md capitalize bg-slate-50 hover:bg-slate-800 hover:text-white  text-slate-800 border border-slate-100 hover:border-slate-800 shadow-sm"
							>
								{cat.label}
							</a>
						);
					})}
			</nav>
			<div className="post-lists grid grid-cols-3 gap-4">
				{isLoading ? (
					<p>{__('Loading...', 'newsly')}</p>
				) : null}
				{attributes.fetchedPosts.length > 0 &&
					attributes.fetchedPosts.map((post, index) => {
						return (
							<div
								key={index}
								className="card shadow-md hover:shadow-lg rounded border-solid border-black-200 border-x border-y p-8"
							>
								{/* {attributes.showFeaturedImage &&
									post.featured_media !== 0 && (
										<GetFeaturedImage
											postId={post.featured_media}
										/>
									)} */}
								<h2 className="mt-4 inline-block font-poppins text-xl text-slate-900 hover:text-slate-600	transition font-medium">
									{post.title.rendered}
								</h2>
								{attributes.showCategory && (
									<RenderPostCategoryData
										catArr={post.categories}
										// parentProps={parentProps}
									/>
								)}
								{attributes.showExcerpt && (
									<div
										dangerouslySetInnerHTML={{
											__html: post.excerpt.rendered,
										}}
										className="text-slate-600 mt-2"
									/>
								)}
							</div>
						);
					})}
			</div>
		</div>
	);
}
