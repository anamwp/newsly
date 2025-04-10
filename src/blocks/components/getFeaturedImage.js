import React from 'react';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * ❗️ Before use this component make sure below data is available ❗️
 * 👉 - Block is having [selectedPostFeaturedImage] attr.
 * 👉 - function [SelectedPostFeaturedImage] is defined in parent component.
 * 
 * Sample function that can be passed as a prop to GetFeaturedImage
 * to handle the selected post featured image.
 * This function can be defined in the parent component.
	const SelectedPostFeaturedImage = (data) => {
		var featuredImageData = data;
		setAttributes({
			selectedPostFeaturedImage: featuredImageData,
		});
	};
 * 👉 this is how you can use this component
	<GetFeaturedImage
		postFeaturedMediaId={postData.featured_media}
		selectedPostFeaturedImage={
			SelectedPostFeaturedImage
		}
	/>
	👉 In the block JSON file attr needs to add like below
	"selectedPostFeaturedImage": {
		"type": "object",
		"default": {}
	}
 */

export default function GetFeaturedImage(props) {
	const { postFeaturedMediaId, selectedPostFeaturedImage } = props;

	const getMediaContent = useSelect(
		(select) => {
			return select('core').getEntityRecords('postType', 'attachment', {
				include: [postFeaturedMediaId],
			});
		},
		[postFeaturedMediaId]
	);
	/**
	 * Store fetch image content to block attribute
	 */
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
