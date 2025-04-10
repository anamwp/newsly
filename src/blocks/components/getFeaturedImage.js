import React from 'react';
import { useSelect, withSelect, select } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';

export default function getFeaturedImage(props) {
	const { postFeaturedMediaId, selectedPostFeaturedImage } = props;

	const getMediaContent = useSelect(
		(select) => {
			return select('core').getEntityRecords('postType', 'attachment', {
				include: [postFeaturedMediaId],
			});
		},
		[postFeaturedMediaId]
	);
	useEffect(() => {
		if (getMediaContent && getMediaContent.length > 0) {
			selectedPostFeaturedImage(getMediaContent[0]); // Pass featured image to parent
		}
	}, [getMediaContent]);

	return (
		<div className="mb-3">
			{getMediaContent
				? getMediaContent.map((data) => {
						return (
							<img
								className="inline-block w-full"
								src={data.source_url}
								alt=""
							/>
						);
				  })
				: 'Fetching Image'}
		</div>
	);
}
