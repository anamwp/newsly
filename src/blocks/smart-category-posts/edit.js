import React from 'react';
import { useState, useEffect } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import GetFeaturedImage from './getFeaturedImage';
import SidebarControl from './sidebarControl';
import apiFetch from '@wordpress/api-fetch';

import RenderPostCategoryData from './components';
import { __ } from '@wordpress/i18n';

export default function edit(props) {
	const blockProps = useBlockProps();

	const { attributes, setAttributes } = props;
	const [isLoading, setIsLoading] = useState(false);
	const perPage = 9; // default value is 9 and also needs to match the ajax call
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
						link: cat.link,
					});
				});
				setAttributes({
					categories: catArr,
				});
			});
	}, []);
	/**
	 * Load posts once on mount
	 */
	useEffect(() => {
		setIsLoading(true);
		apiFetch({
			path: `/wp/v2/posts?per_page=${perPage}`,
		})
			.then((res) => {
				setAttributes({
					fetchedPosts: res,
				});
				setIsLoading(false);
			})
			.catch((err) => console.error(err));
	}, []);

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
				{isLoading ? <p>{__('Loading...', 'gutenberg-starter')}</p> : null}
				{attributes.fetchedPosts.length > 0 &&
					attributes.fetchedPosts.map((post, index) => {
						return (
							<div
								key={index}
								className="card shadow-md hover:shadow-lg rounded border-solid border-black-200 border-x border-y p-8"
							>
								{attributes.showFeaturedImage &&
									post.featured_media !== 0 && (
										<GetFeaturedImage
											postId={post.featured_media}
										/>
									)}
								<h2 className="mt-4 inline-block font-poppins text-xl text-slate-900 hover:text-slate-600	transition font-medium">
									{post.title.rendered}
								</h2>
								{attributes.showCategory && (
									<RenderPostCategoryData
										catArr={post.categories}
										categories={attributes.categories}
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
