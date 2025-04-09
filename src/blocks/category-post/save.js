import { __ } from '@wordpress/i18n';
import React, { useState, useEffect } from 'react';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import GetFeaturedImage from './getFeaturedImage';
import RenderPostCategoryData from './components';
import apiFetch from '@wordpress/api-fetch';

export default function save(props) {
	console.log('save props', props.attributes);
	// const blockProps = useBlockProps();
	const blockProps = useBlockProps.save({
		className: 'gts_block__category_post',
	});
	const postData = props.attributes.fetchedPosts;
	const selectedPostCategory = props.attributes.selectedPostCategory;
	const selectedPostFeaturedImage =
		props.attributes.selectedPostFeaturedImage;

	/**
	 * component to display post card
	 * @param {*} props
	 * @returns
	 * post card content
	 */
	const PostCard = (props) => {
		let postData = props.data;
		let parentProps = props.parent;
		console.log('parentProps', parentProps);
		const featuredImage =
			postData._embedded['wp:featuredmedia']?.[0]?.source_url;

		const categories = postData._embedded['wp:term']?.[0] || [];
		// console.log(featuredImage, categories);

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
				{/* <Disabled> */}
				<a
					href={postData.link}
					className="inline-block w-full no-underline font-poppins text-xl text-slate-900 hover:text-slate-600 transition font-medium mb-2"
				>
					<h3>{postData.title.rendered}</h3>
				</a>
				{/* </Disabled> */}
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

	return (
		<div className="gts_block__category_post">
			<div className="cat-label">
				{props.attributes.selectedCategroyName && (
					<p className="text-xl font-semibold capitalize mb-5">
						{props.attributes.selectedCategroyName}
					</p>
				)}
			</div>
			<div
				className={`post-wrapper grid grid-cols-${props.attributes.postColumn}`}
			>
				{props.attributes.fetchedPosts.length > 0 &&
					props.attributes.fetchedPosts[0]
						.slice(0, props.attributes.postsToShow)
						.map((post) => <PostCard data={post} parent={props} />)}
			</div>
		</div>
	);
}
