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
				className="p-10 container gts__blurb__container rounded-md w-full max-w-full"
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
					className='mt-0 mb-3 font-poppins text-2xl text-slate-700 font-medium'
					value={props.attributes.newcontent}
				/>
				<RichText.Content
					tagName="p"
					style={{
						color: props.attributes.content_color,
					}}
					className='text-slate-600'
					value={props.attributes.newmessage}
				/>
				<div className="gts__blurb__button pt-6">
					<InnerBlocks.Content />
				</div>
			</div>
		</div>
	);
}
