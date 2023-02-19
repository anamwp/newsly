import React from 'react';
import { TextControl } from '@wordpress/components';
import {
	useBlockProps,
	RichText,
	AlignmentToolbar,
	BlockControls,
	ColorPalette,
	InspectorControls,
} from '@wordpress/block-editor';

export default function save(props) {
	/**
	 * get block props and
	 * assign it to a variable
	 */
	const blockProps = useBlockProps.save();
	/**
	 * return save data
	 *  */
	return (
		<div {...blockProps}>
			<RichText.Content
				{...blockProps}
				tagName="p"
				style={{
					background: props.attributes.bg_color,
					color: props.attributes.text_color,
					textAlign: props.attributes.alignment,
				}}
				value={props.attributes.newcontent}
			/>
			<div>{props.attributes.newmessage}</div>
		</div>
	);
}
