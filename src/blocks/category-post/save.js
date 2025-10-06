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
		className: `newsly__category_post gs-cols-${props.attributes.postColumn} ${gridClass}`,
		'data-categories': JSON.stringify(props.attributes.selectedCategories),
		'data-active-tab': props.attributes.activeTab || (props.attributes.selectedCategories.length > 0 ? props.attributes.selectedCategories[0].id : null),
		'data-posts-to-show': props.attributes.postsToShow,
		'data-post-column': props.attributes.postColumn,
	});
	const postData = props.attributes.allCategoryPosts;
	console.log('postData', postData);
	// debugger;

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
						<nav role="tablist" aria-label="Category tabs">
							<ul className="-mb-px flex space-x-8">
							{props.attributes.selectedCategories.map((category, index) => {
								const isActive = Number(props.attributes.activeTab) === Number(category.id);
								console.log('isActive', isActive);
								return (
									<li role="presentation" key={category.id}>
									<button
										role="tab"
										aria-controls={`category-tab-content-${category.id}`}
										aria-selected={isActive}
										id={`category-tab-${category.id}`}
									className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
										isActive
											? 'border-blue-500 text-blue-600'
											: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
									}`}
									tabindex="0"
									data-category-id={category.id}
									>
										{category.label}
									</button>
									</li>
								)
							})}
							</ul>
						</nav>
					</div>
				)}
			</div>
			
			<div
				className={`post-wrapper`}
				aria-live="polite"
				aria-atomic="true"
			>
				{
					typeof props.attributes.allCategoryPosts === 'object' && Object.keys(props.attributes.allCategoryPosts).length > 0 && (
						Object.entries(props.attributes.allCategoryPosts).map(([catID, post], index) => {
							return (
								<div 
									key={index} 
									className={`tab-content ${ Number(catID) === Number(props.attributes.activeTab) ? 'active grid' : 'hidden' }  gs-cols-${props.attributes.postColumn} gap-5`} 
									id={`category-tab-content-${catID}`}
									role="tabpanel"
									aria-labelledby={`category-tab-${catID}`}
									aria-hidden={Number(catID) === Number(props.attributes.activeTab) ? 'false' : 'true'}
									aria-expanded={Number(catID) === Number(props.attributes.activeTab) ? 'true' : 'false'}
								>
									{post.slice(0, props.attributes.postsToShow).map((post, index) => {
										return <GSPostCard 
										key={index} 
										data={post} 
										parent={props} 
										/>;
									})}
								</div>
							);
						})
					)
				}
			</div>
			
		</div>
	);
}
