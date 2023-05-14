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

const MY_TEMPLATE = [['core/button', { placeholder: 'Book Your Demo' }]];

export default function edit({ attributes, setAttributes }) {
	const [fontSize, setFontSize] = useState(12);
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
								__nextHasNoMarginBottom
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
					tagName="h2"
					style={{
						color: attributes.text_color,
					}}
					onChange={onChangeContent}
					value={attributes.newcontent}
					placeholder="this is rich text editor"
				/>
				<RichText
					tagName="p"
					style={{
						color: attributes.content_color,
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
