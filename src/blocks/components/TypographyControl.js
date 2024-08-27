import React from 'react';
import { __ } from '@wordpress/i18n';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';

import {
	SelectControl,
	FontSizePicker,
	RangeControl,
} from '@wordpress/components';

/**
 * How to use 
 * [textColorAttribute] = text color attributes name from block json file
 * [linkColorAttribute] = text color attributes name from block json file
 * [linkHoverColorAttribute] = text color attributes name from block json file
 * this values are passed from parent component
 * and needs to reuse through style ={{color: attributes[textColorAttribute]}} tag
 * ==========
<TabPanelForTextAndLink
	attributes={attributes}
	setAttributes={setAttributes}
	textColorAttribute="headingColor"
	linkColorAttribute="linkColor"
	linkHoverColorAttribute="linkHoverColor"
/>
 *
 */

/**
 *
 * @param {*} param0
 * @returns
 */
export default function TypographyControl({
	attributes,
	setAttributes,
	titleFontWeightAttr,
	titleFontSizeAttr,
	titleLetterSpacingAttr,
	titleLineHeightAttr,
	titleStyleAttr,
	titleDecorationAttr,
	titleTransformAttr,
}) {
	/**
	 * Font size options
	 */
	const fontSizes = [
		{
			name: __('Small'),
			slug: 'small',
			size: 16,
		},
		{
			name: __('Medium'),
			slug: 'medium',
			size: 22,
		},
		{
			name: __('Big'),
			slug: 'big',
			size: 26,
		},
	];
	/**
	 * Fallback font size
	 */
	const fallbackFontSize = 26;
	/**
	 * Set default color options
	 */
	const fontWeightVariationOptions = [
		{ value: '400', label: '400' },
		{ value: '100', label: '100' },
		{ value: '200', label: '200' },
		{ value: '300', label: '300' },
		{ value: '500', label: '500' },
		{ value: '600', label: '600' },
		{ value: '700', label: '700' },
		{ value: '800', label: '800' },
		{ value: '900', label: '900' },
	];
	const styleVariationOptions = [
		{ value: 'normal', label: 'Default' },
		{ value: 'italic', label: 'Italic' },
		{ value: 'oblique', label: 'Oblique' },
	];
	const defcorationVariationOptions = [
		{ value: 'none', label: 'Default' },
		{ value: 'overline', label: 'Overline' },
		{ value: 'underline', label: 'Underline' },
		{ value: 'line-through', label: 'Line Through' },
	];
	const transformVariationOptions = [
		{ value: 'none', label: 'Default' },
		{ value: 'capitalize', label: 'Capitalize' },
		{ value: 'uppercase', label: 'Uppercase' },
		{ value: 'lowercase', label: 'Lowercase' },
	];
	/**
	 * Handle color change and set attributes value
	 * @param {*} attrName
	 * @returns
	 */
	const handleSelectControl = (attrName) => {
		return (newValue) => {
			setAttributes({
				[attrName]: newValue,
			});
		};
	};

	return (
		<div class="gts__typography-panel">
			<SelectControl
				label={__('Font Weight')}
				options={fontWeightVariationOptions}
				value={attributes[titleFontWeightAttr]}
				onChange={handleSelectControl(titleFontWeightAttr)}
			/>
			<FontSizePicker
				fontSizes={fontSizes}
				value={attributes[titleFontSizeAttr]}
				fallbackFontSize={fallbackFontSize}
				withReset={true}
				withSlider={true}
				// units={['px', 'em', 'rem']}
				onChange={(titleFontSize) => {
					setAttributes({
						[titleFontSizeAttr]: titleFontSize,
					});
				}}
			/>
			<RangeControl
				__nextHasNoMarginBottom
				label="Letter Spacing"
				value={attributes[titleLetterSpacingAttr]}
				onChange={(value) =>
					setAttributes({
						[titleLetterSpacingAttr]: value,
					})
				}
				min={1}
				max={10}
				allowReset={true}
				step={0.1}
			/>
			<RangeControl
				__nextHasNoMarginBottom
				label="Line Height"
				value={attributes[titleLineHeightAttr]}
				onChange={(value) =>
					setAttributes({
						[titleLineHeightAttr]: value,
					})
				}
				min={1}
				max={10}
				allowReset={true}
				step={0.1}
			/>
			<SelectControl
				label={__('Style')}
				value={attributes[titleStyleAttr]}
				options={styleVariationOptions}
				onChange={handleSelectControl(titleStyleAttr)}
			/>
			<SelectControl
				label={__('Decoration')}
				value={attributes[titleDecorationAttr]}
				options={defcorationVariationOptions}
				onChange={handleSelectControl(titleDecorationAttr)}
			/>
			<SelectControl
				label={__('Transform')}
				value={attributes[titleTransformAttr]}
				options={transformVariationOptions}
				onChange={handleSelectControl(titleTransformAttr)}
			/>
		</div>
	);
}
