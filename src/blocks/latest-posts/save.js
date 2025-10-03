import { __ } from '@wordpress/i18n';
import React from 'react';
import { useBlockProps } from '@wordpress/block-editor';
import GSPostCardOverlay from '../components/GSPostCardOverlay';

export default function save(props) {
	const blockProps = useBlockProps.save({
		className: 'newsly_block__latest_posts',
	});
	const postData = props.attributes.fetchedPosts;

	return (
		<div {...blockProps}>
			{postData.length > 0 && (
				postData.slice(0, props.attributes.numberOfPosts).map((post) => (
					<GSPostCardOverlay key={post.id} data={post} parent={props} />
				))
			)}
		</div>
	);
}
