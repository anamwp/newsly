import React from 'react';
import { __ } from '@wordpress/i18n';
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

const GTS_BLURB_FOOTER_TEMPLATE = [
	[
		'core/button',
		{
			text: __('Book Your Demo', 'gutenberg-starter'),
			placeholder: __('Book Your Demo', 'gutenberg-starter'),
			customClass: 'inline-block mt-6',
		},
	],
];

export default function edit({ attributes, setAttributes }) {
	const [fontSize, setFontSize] = useState(12);
	const [isChecked, setChecked] = useState(true);
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
								{__(
									'Set the blurb background color',
									'gutenberg-starter'
								)}
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
					className="mt-0 mb-3 font-poppins text-2xl text-slate-700 font-medium"
					onChange={onChangeContent}
					id="gts-blurb-heading"
					value={attributes.newcontent}
					placeholder={__(
						'this is rich text editor',
						'gutenberg-starter'
					)}
				/>
				<RichText
					tagName="p"
					style={{
						color: attributes.content_color,
					}}
					className="text-slate-600"
					id="gts-blurb-text"
					onChange={(val) => setAttributes({ newmessage: val })}
					value={attributes.newmessage}
					placeholder={__('hello text control', 'gutenberg-starter')}
				/>
				<div className="gts__blurb__button pt-6">
					<InnerBlocks
						template={GTS_BLURB_FOOTER_TEMPLATE}
						templateLock="all"
						allowedBlocks={['core/button']}
					/>
				</div>
			</div>
		</div>
	);
}
