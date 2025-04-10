import { __ } from '@wordpress/i18n';
import React, { useState, useEffect } from 'react';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import GetFeaturedImage from './getFeaturedImage';
import RenderPostCategoryData from './components';
import apiFetch from '@wordpress/api-fetch';
import GSPostCard from '../components/GSPostCard';

export default function save(props) {
	// const blockProps = useBlockProps();
	const blockProps = useBlockProps.save({
		className: 'gts_block__single_post',
	});
	const postData = props.attributes.fetchedPosts;
	const selectedPostCategory = props.attributes.selectedPostCategory;
	const selectedPostFeaturedImage =
		props.attributes.selectedPostFeaturedImage;

	return (
		<div className="gts_block__single_post">
			{/* {props.attributes.selectedPostId &&
				props.attributes.fetchedPosts.length > 0 && (
				)} */}
			{postData.length > 0 && (
				<GSPostCard data={postData[0]} parent={props} />
			)}
		</div>
	);
}
