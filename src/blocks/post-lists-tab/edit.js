import React from 'react';
import { useSelect, withSelect, select } from '@wordpress/data';
import { useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import GetFeaturedImage from './getFeaturedImage';
import SidebarControl from './sidebarControl';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

import RenderPostCategoryData from './components';
import { __ } from '@wordpress/i18n';

export default function edit(props) {
	const blockProps = useBlockProps();

	const { attributes, setAttributes } = props;
	const [isLoading, setIsLoading] = useState(false);
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
			.catch((err) => {
				console.log('err', err);
				setIsLoading(false);
			});
	}, []);

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
					className="active tablinks no-underline px-4 py-2 font-semibold transition-all text-sm rounded-md border shadow-sm"
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
								className="tablinks no-underline px-4 py-2 font-semibold text-sm transition-all rounded-md capitalize border shadow-sm"
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
								className="post-card shadow-md hover:shadow-lg rounded border-solid border-x border-y p-8"
							>
								{attributes.showFeaturedImage &&
									post.featured_media !== 0 && (
										<GetFeaturedImage
											postId={post.featured_media}
										/>
									)}
								<h2 className="post-card__title mt-4 inline-block font-poppins text-xl transition font-medium">
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
										className="post-card__excerpt mt-2"
									/>
								)}
							</div>
						);
					})}
			</div>
		</div>
	);
}
