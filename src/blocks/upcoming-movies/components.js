import React from 'react';
import apiFetch from '@wordpress/api-fetch';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';

export default function RenderPostCategoryData(props) {
	let postArr = props.catArr.toString();
	const [catData, setCatData] = useState();
	// const {attributes, setAttributes} = props.parentProps;

	useEffect(() => {
		apiFetch({
			path: `/wp/v2/categories?include=${postArr}`,
		})
			.then((res) => {
				setCatData(res);
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
						>
							{singleCat.name}
						</a>
					);
				})}
		</div>
	);
}
