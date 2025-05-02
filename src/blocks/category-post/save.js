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
	});
	const postData = props.attributes.fetchedPosts;

	return (
		<div {...blockProps}>
			<div className="cat-label">
				{props.attributes.selectedCategroyName && (
					<p className="text-xl font-semibold capitalize mb-5">
						{props.attributes.selectedCategroyName}
					</p>
				)}
			</div>
			<div
				className={`post-wrapper grid gs-cols-${props.attributes.postColumn}`}
			>
				{postData.length > 0 &&
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
