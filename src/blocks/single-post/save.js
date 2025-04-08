import { __ } from '@wordpress/i18n';
import React, { useState, useEffect } from 'react';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import GetFeaturedImage from './getFeaturedImage';
import RenderPostCategoryData from './components';
import apiFetch from '@wordpress/api-fetch';

export default function save(props) {
	// const blockProps = useBlockProps();
	const blockProps = useBlockProps.save({
		className: 'gts_block__single_post',
	});
	const postData = props.attributes.fetchedPosts;
	const selectedPostCategory = props.attributes.selectedPostCategory;
	const selectedPostFeaturedImage =
		props.attributes.selectedPostFeaturedImage;

	return (
		<div className="gts_block__single_post">
			{/* {props.attributes.selectedPostId &&
				props.attributes.fetchedPosts.length > 0 && (
				)} */}
			{postData.length > 0 && (
				<div className="single-post-card">
					<div className="mb-3">
						{selectedPostFeaturedImage ? (
							<img
								className="inline-block w-full"
								src={selectedPostFeaturedImage.source_url}
								alt=""
							/>
						) : (
							'Fetching Image'
						)}
					</div>
					{/* <GetFeaturedImage postId={postData[0].featured_media} /> */}
					<div className="mb-3">
						{selectedPostCategory &&
							selectedPostCategory.map((singleCat) => {
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
					<a
						href={postData[0].link}
						className="inline-block w-full no-underline font-poppins text-xl text-slate-900 hover:text-slate-600 transition font-medium"
					>
						<h3>{postData[0].title.rendered}</h3>
					</a>

					{/* <RichText
						tagName="p"
						value={postData[0].excerpt.rendered}
					/> */}
					{/* <div>{postData[0].excerpt.rendered}</div> */}
					<div
						className="font-poppins text-slate-900 mt-2"
						dangerouslySetInnerHTML={{
							__html: postData[0].excerpt.rendered,
						}}
					/>
				</div>
			)}
		</div>
	);
}
