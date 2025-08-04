import React, { useState, useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { RawHTML, useRef } from '@wordpress/element';

export default function RenderPostCategoryData(props) {
	let postArr = props.catArr.toString();
	const [catData, setCatData] = useState(null);
	// const {attributes, setAttributes} = props.parentProps;

	useEffect(() => {
		if (postArr) {
			apiFetch({
				path: `/wp/v2/categories?include=${postArr}`,
			})
				.then((res) => {
					setCatData(res);
				})
				.catch((err) => console.log(err));
		}
	}, [postArr]);

	return (
		<div>
			{!catData && <p>Fetching Data</p>}
			{catData &&
				Array.isArray(catData) &&
				catData.map((singleCat, index) => {
					return (
						<a
							key={singleCat.id || index}
							href={singleCat.link}
							style={{ marginRight: '10px' }}
						>
							{singleCat.name}
						</a>
					);
				})}
		</div>
	);
}
