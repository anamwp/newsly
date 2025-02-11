import { __ } from '@wordpress/i18n';
import React from 'react';
import {
	TextControl,
	ColorPicker,
	Panel,
	PanelBody,
	PanelRow,
	FontSizePicker,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { more } from '@wordpress/icons';
import apiFetch from '@wordpress/api-fetch';

import {
	useBlockProps,
	RichText,
	AlignmentToolbar,
	BlockControls,
	ColorPalette,
	InnerBlocks,
	InspectorControls,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

// const blockStyle = {
// 	backgroundColor: '#900',
// 	color: '#fff',
// 	padding: '20px',
// };

const fontSizes = [
	{
		name: __('Small'),
		slug: 'small',
		size: 12,
	},
	{
		name: __('Big'),
		slug: 'big',
		size: 26,
	},
];
const fallbackFontSize = 16;
const MY_TEMPLATE = [
	// ['core/image', {}],
	// ['core/heading', { placeholder: 'Book Title' }],
	// ['core/paragraph', { placeholder: 'Summary' }],
	['core/button', { placeholder: 'Book Your Demo' }],
];

export default function edit({ attributes, setAttributes }) {
	/**
	 * Create a new post
	 */
	// useEffect(() => {
	// 	apiFetch( {
	// 		path: '/wp/v2/comments',
	// 		method: 'POST',
	// 		data: {
	// 			title: 'New Post Title 2',
	// 			author: 1,
	// 			status: 'publish',
	// 			content: 'This is the content of',
	// 			author_name: 'Gaurav Tiwari',
	// 			post: 1, // Replace with your post ID
	// 			author_email: 'rishi.shah@multidots.com',
	// 			type: 'comment_review',
	// 		},
	// 	} ).then( ( res ) => {
	// 		console.log( res );
	// 	} );
	// }, []);

	const [fontSize, setFontSize] = useState(12);
	/**
	 * pass style through useBlockProps()
	 */
	const blockProps = useBlockProps({
		className: 'gts__blurb',
		// style: blockStyle,
	});
	/**
	 *
	 * @param {*} newContent
	 */
	const onChangeContent = (newContent) => {
		setAttributes({
			newcontent: newContent,
		});
	};
	/**
	 *
	 * @param {*} newColor
	 */
	const onChangeTextColor = (newColor) => {
		setAttributes({
			text_color: newColor,
		});
	};
	/**
	 *
	 * @param {*} newBGColor
	 */
	// const onChangeBGColor = (newBGColor) => {
	// 	setAttributes({
	// 		bg_color: newBGColor,
	// 	});
	// };
	const handleTextColor = (newColor) => {
		setAttributes({
			content_color: newColor,
		});
	};
	// const handleTextBackground = (newBGColor) => {
	// 	setAttributes({
	// 		content_bg_color: newBGColor,
	// 	});
	// };
	/**
	 *
	 * @param {*} newAlignment
	 */
	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: 'undefined' === newAlignment ? none : newAlignment,
		});
	};
	/**
	 * return edit content
	 */
	return (
		<div {...blockProps}>
			{/* block level control in the editor */}
			{
				<BlockControls>
					<AlignmentToolbar
						value={attributes.alignment}
						onChange={onChangeAlignment}
					/>
				</BlockControls>
			}
			{/* for sidebar control */}
			<InspectorControls key={'settings'}>
				<div id="blurb__controls">
					<Panel header="">
						<PanelBody
							title="Background"
							icon={more}
							initialOpen={true}
						>
							<PanelRow>
								Set the total block background color
							</PanelRow>
							<ColorPicker
								onChange={(newFontSize) => {
									setAttributes({
										blurb_bg_color: newFontSize,
									});
								}}
							/>
						</PanelBody>
						<PanelBody title="Heading" initialOpen={false}>
							<PanelRow>
								<ColorPalette onChange={onChangeTextColor} />
							</PanelRow>
						</PanelBody>
						<PanelBody title="Text" initialOpen={false}>
							<PanelRow>
								<ColorPalette onChange={handleTextColor} />
							</PanelRow>
						</PanelBody>

						<PanelBody
							title="FontSizePicker Component"
							initialOpen={false}
						>
							<FontSizePicker
								__nextHasNoMarginBottom={true}
								fontSizes={fontSizes}
								value={fontSize}
								fallbackFontSize={fallbackFontSize}
								onChange={(newFontSize) => {
									setFontSize(newFontSize);
								}}
							/>
						</PanelBody>
					</Panel>
				</div>
			</InspectorControls>

			<div
				className="container gts__blurb__container"
				style={{
					textAlign: attributes.alignment,
					background: attributes.blurb_bg_color,
				}}
			>
				{/* Rich Text control */}
				<RichText
					// {...blockProps}
					tagName="h2"
					style={{
						// background: attributes.bg_color,
						color: attributes.text_color,
					}}
					onChange={onChangeContent}
					value={attributes.newcontent}
					placeholder="this is rich text editor"
				/>
				<RichText
					tagName="p"
					style={{
						// background: attributes.bg_color,
						color: attributes.content_color,
						// textAlign: attributes.alignment,
					}}
					onChange={(val) => setAttributes({ newmessage: val })}
					value={attributes.newmessage}
					placeholder="hello text control"
				/>
				<div className="gts__blurb__button">
					<InnerBlocks
						template={MY_TEMPLATE}
						templateLock="all"
						allowedBlocks={['core/button']}
					/>
				</div>
			</div>
		</div>
	);
}
