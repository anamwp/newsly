import { __ } from '@wordpress/i18n';
import React from 'react';
import { useBlockProps } from '@wordpress/block-editor';
import GSPostCard from '../components/GSPostCard';

export default function save(props) {
	const blockProps = useBlockProps.save({
		className: 'gts_block__single_post',
	});
	const postData = props.attributes.fetchedPosts;

	return (
		<div {...blockProps}>
			{postData.length > 0 && (
				<GSPostCard data={postData[0]} parent={props} />
			)}
		</div>
	);
}
