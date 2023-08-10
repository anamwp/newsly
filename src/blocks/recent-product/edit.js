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

const MY_TEMPLATE = [['core/button', { placeholder: 'Book Your Demo' }]];

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
		className: 'gts_block__recent_product',
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
			{<BlockControls></BlockControls>}
			{/* for sidebar control */}
			<InspectorControls key={'settings'}></InspectorControls>

			{/* View */}
			<div className="container gts_block__recent_product__container">
				<h2>Recent Product</h2>
			</div>
		</div>
	);
}
