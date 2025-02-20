import React from 'react';
import { useSelect, withSelect, select } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';

export default function getFeaturedImage(props) {
	const { postId } = props;

	const getMediaContent = useSelect(
		(select) => {
			return select('core').getEntityRecords('postType', 'attachment', {
				include: [postId],
			});
		},
		[postId]
	);

	return (
		<div>
			{getMediaContent
				? getMediaContent.map((data) => {
						return (
							<img
								src={
									data.media_details.sizes.thumbnail
										.source_url
								}
								alt=""
							/>
						);
				  })
				: 'Fetching Image'}
		</div>
	);
}
