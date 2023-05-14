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
		className: 'gts__blurb',
	});
	/**
	 * return save data
	 *  */
	return (
		<div {...blockProps}>
			<div
				className="container gts__blurb__container"
				style={{
					textAlign: props.attributes.alignment,
					background: props.attributes.blurb_bg_color,
				}}
			>
				<RichText.Content
					tagName="h2"
					style={{
						color: props.attributes.text_color,
					}}
					value={props.attributes.newcontent}
				/>
				<RichText.Content
					tagName="p"
					style={{
						color: props.attributes.content_color,
					}}
					value={props.attributes.newmessage}
				/>
				<div className="gts__blurb__button">
					<InnerBlocks.Content />
				</div>
			</div>
		</div>
	);
}
