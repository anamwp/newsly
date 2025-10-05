import { __ } from '@wordpress/i18n';
import React from 'react';
import { useBlockProps } from '@wordpress/block-editor';
import GSPostCard from '../components/GSPostCard';

export default function save(props) {
	const gridClass =
		props.attributes.layout === 'grid'
			? `grid-${props.attributes.postColumn}`
			: '';
	const blockProps = useBlockProps.save({
		className: `gts__category_post gs-cols-${props.attributes.postColumn} ${gridClass}`,
		'data-categories': JSON.stringify(props.attributes.selectedCategories),
		'data-active-tab': props.attributes.activeTab || (props.attributes.selectedCategories.length > 0 ? props.attributes.selectedCategories[0].id : null),
		'data-posts-to-show': props.attributes.postsToShow,
		'data-post-column': props.attributes.postColumn,
	});
	const postData = props.attributes.fetchedPosts;

	return (
		<div {...blockProps}>
			<div className="cat-label">
				{props.attributes.selectedCategories.length > 0 && (
					<p className="text-xl font-semibold capitalize mb-5">
						{props.attributes.selectedCategories.length === 1 
							? props.attributes.selectedCategories[0].label
							: `${props.attributes.selectedCategories.length} Categories Selected`
						}
					</p>
				)}
				{/* Show all categories as tabs */}
				{props.attributes.selectedCategories.length > 0 && (
					<div className="border-b border-gray-200 mb-6">
						<nav className="-mb-px flex space-x-8">
							{props.attributes.selectedCategories.map((category, index) => (
								<button
									key={category.id}
									className={`category-tab ${index === 0 ? 'active' : ''}`}
									data-category-id={category.id}
								>
									{category.label}
								</button>
							))}
						</nav>
					</div>
				)}
			</div>
			<div
				className={`post-wrapper grid gs-cols-${props.attributes.postColumn}`}
			>
				{postData.length > 0 &&
					postData[0] &&
					postData[0]
						.slice(0, props.attributes.postsToShow)
						.map((post, index) => (
							<GSPostCard
								key={index}
								data={post}
								parent={props}
								numberKey={index}
							/>
						))}
			</div>
		</div>
	);
}
