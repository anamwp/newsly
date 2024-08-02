import { __ } from '@wordpress/i18n';
import React from 'react';
import {
	TextControl,
	ColorPicker,
	Panel,
	PanelBody,
	PanelRow,
	FontSizePicker,
	CheckboxControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { more } from '@wordpress/icons';

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
import classNames from 'classnames';

const MY_TEMPLATE = [['core/button', { text: 'Book Your Demo', placeholder: 'Book Your Demo', customClass: 'inline-block mt-6', }]];

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

export default function edit({ attributes, setAttributes }) {
	const [fontSize, setFontSize] = useState(12);
	const [isChecked, setChecked] = useState(true);
	console.log('attributes', attributes);
	console.log('fontSize', fontSize);
	/**
	 * pass style through useBlockProps()
	 */
	const blockProps = useBlockProps({
		className: 'gts__blurb',
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
	const handleTextColor = (newColor) => {
		setAttributes({
			content_color: newColor,
		});
	};
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
								Set the blurb background color
							</PanelRow>
							<ColorPalette
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
					</Panel>
				</div>
			</InspectorControls>

			{/* View */}
			<div
				className="p-10 container gts__blurb__container rounded-md w-full max-w-full"
				style={{
					textAlign: attributes.alignment,
					background: attributes.blurb_bg_color,
				}}
			>
				{/* Rich Text control */}
				<RichText
					tagName="h2"
					style={{
						color: attributes.text_color,
					}}
					className='mt-0 mb-3 font-poppins text-2xl text-slate-700 font-medium'
					onChange={onChangeContent}
					value={attributes.newcontent}
					placeholder="this is rich text editor"
				/>
				<RichText
					tagName="p"
					style={{
						color: attributes.content_color,
					}}
					className='text-slate-600'
					onChange={(val) => setAttributes({ newmessage: val })}
					value={attributes.newmessage}
					placeholder="hello text control"
				/>
				<div className="gts__blurb__button pt-6">
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
