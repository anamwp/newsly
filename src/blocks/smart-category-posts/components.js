import React from 'react';

/**
 * Renders the category names for a single post.
 *
 * Looks the names up locally in the block's already-fetched category
 * list (attributes.categories) instead of issuing a REST request per
 * post - the parent block fetches the full category list once on mount,
 * so there is no need for every post card to hit the API again.
 *
 * @param {Object} props
 * @param {number[]} props.catArr - category IDs assigned to this post
 * @param {Object[]} props.categories - all categories: [{label, value, slug, link}]
 * @returns {JSX.Element}
 */
export default function RenderPostCategoryData({ catArr = [], categories = [] }) {
	const matchedCategories = categories.filter((category) =>
		catArr.includes(category.value),
	);

	return (
		<div>
			{matchedCategories.length === 0 && <p>Fetching Data</p>}
			{matchedCategories.map((category) => (
				<a
					key={category.value}
					href={category.link}
					style={{ marginRight: '10px' }}
				>
					{category.label}
				</a>
			))}
		</div>
	);
}
