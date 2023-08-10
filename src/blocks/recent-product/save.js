import React from 'react';
import { TextControl } from '@wordpress/components';
import {
	useBlockProps,
	RichText,
	AlignmentToolbar,
	BlockControls,
	ColorPalette,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';

export default function save(props) {
	/**
	 * get block props and
	 * assign it to a variable
	 */
	const blockProps = useBlockProps.save({
		className: 'gts_block__recent_product',
	});
	/**
	 * return save data
	 *  */
	return (
		<div {...blockProps}>
			<div className="container gts_block__recent_product__container">
				<h2>Recent Product</h2>
			</div>
		</div>
	);
}
