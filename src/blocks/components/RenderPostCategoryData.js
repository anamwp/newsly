import React from 'react';
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';

/**
 * ❗️ Before use this component make sure below data is available ❗️
 * 👉 - your block attributes has [selectedPostCategory] attr
 * 👉 - parent component has function [UpdateCatAttrCallback] like below
 * 
	const UpdateCatAttrCallback = (data) => {
		var catData = data;
		setAttributes({
			selectedPostCategory: catData,
		});
	};
 	👉 pass props like below from the parent component
	<RenderPostCategoryData
		catArr={postData.categories}
		parentProps={parentProps}
		updateCatAttrCallback={UpdateCatAttrCallback}
	/>;
 */

/**
 * Fetch multiple category from the REST API and display them.
 * @param {array} catArr - array of category ids - [1,2,3]
 * @param {object} parentProps - parent attributes
 * @param {function} updateCatAttrCallback - function to update the attributes
 * @returns
 */
export default function RenderPostCategoryData(props) {
	let postArr = props.catArr.toString();
	const [catData, setCatData] = useState([]);
	const { attributes, setAttributes } = props.parentProps;

	useEffect(() => {
		if (!postArr) return;
		apiFetch({
			path: `/wp/v2/categories?include=${postArr}`,
		})
			.then((res) => {
				setCatData(res);
				/**
				 * if selectedPostCategory is not same as
				 * the response then update the attributes
				 */
				if (
					JSON.stringify(res) !==
					JSON.stringify(
						props.parentProps.attributes.selectedPostCategory
					)
				) {
					props.updateCatAttrCallback(res);
				}
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<div>
			{!catData && <p>Fetching Data</p>}
			{catData &&
				catData.map((singleCat) => {
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
	);
}
