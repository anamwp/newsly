import React from 'react';
import apiFetch from '@wordpress/api-fetch';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';

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
