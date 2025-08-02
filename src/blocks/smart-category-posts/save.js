import { __ } from '@wordpress/i18n';
import React from 'react';
import RenderPostCategoryData from './components';
import GetFeaturedImage from './getFeaturedImage';
import { useBlockProps } from '@wordpress/block-editor';

export default function save(props) {
	console.log('props', props);
	const { attributes } = props;
	const blockProps = useBlockProps.save();
	console.log('attributes', attributes);
	console.log('attributes fetchedPosts', attributes.fetchedPosts);
	return (
		<div {...blockProps}>
			<nav className="tab mb-10 flex gap-2 p-4 pl-0">
				<a
					href=""
					className="active tablinks no-underline px-4 py-2 font-semibold transition-all text-sm bg-slate-800  bg-slate-50 text-white hover:bg-slate-800 hover:text-white border border-slate-100 rounded-md shadow-sm"
				>
					{__('All', 'gutenberg-starter')}
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
