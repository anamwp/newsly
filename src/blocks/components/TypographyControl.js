import React from 'react';
import { __ } from '@wordpress/i18n';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';

import {
	SelectControl,
	FontSizePicker,
	RangeControl,
	__experimentalHeading as Heading,
	Flex,
	FlexItem,
	// GrayBox,
} from '@wordpress/components';
import {
	Icon,
	more,
	arrowLeft,
	arrowRight,
	arrowUp,
	arrowDown,
	trash,
	settings,
	typography,
} from '@wordpress/icons';

/**
 * How to use 
 * [textFontWeightAttr] = font weight attributes name from block json file
 * [textFontSizeAttr] = font size attributes name from block json file
 * [textLetterSpacingAttr] = letter spacing attributes name from block json file
 * [textLineHeightAttr] = line height attributes name from block json file
 * [textStyleAttr] = font style attributes name from block json file
 * [textDecorationAttr] = text decoration attributes name from block json file
 * [textTransformAttr] = text transform attributes name from block json file
 * this values are passed from parent component
 * and needs to reuse through style ={{color: attributes[textColorAttribute]}} tag
 * ==========
<TypographyControl
	attributes={attributes}
	setAttributes={setAttributes}
	textFontWeightAttr = "respection-key-value-from-block.json-file"
	textFontSizeAttr = "respection-key-value-from-block.json-file"
	textLetterSpacingAttr = "respection-key-value-from-block.json-file"
	textLineHeightAttr = "respection-key-value-from-block.json-file"
	textStyleAttr = "respection-key-value-from-block.json-file"
	textDecorationAttr = "respection-key-value-from-block.json-file"
	textTransformAttr = "respection-key-value-from-block.json-file"
/>
 *
 */

/**
 *
 * @param {*} attributes object
 * @param {*} setAttributes function
 * @param {*} textFontWeightAttr string
 * @param {*} textFontSizeAttr number
 * @param {*} textLetterSpacingAttr number
 * @param {*} textLineHeightAttr number
 * @param {*} textStyleAttr string
 * @param {*} textDecorationAttr string
 * @param {*} textTransformAttr string
 * @returns HTML
 */
export default function TypographyControl({
	attributes,
	setAttributes,
	textFontWeightAttr,
	textFontSizeAttr,
	textLetterSpacingAttr,
	textLineHeightAttr,
	textStyleAttr,
	textDecorationAttr,
	textTransformAttr,
}) {
	/**
	 * Font size default options
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
	 * Fallback default font size
	 */
	const fallbackFontSize = 26;
	/**
	 * Set default font weight options
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
	/**
	 * Default style options
	 */
	const styleVariationOptions = [
		{ value: 'normal', label: 'Default' },
		{ value: 'italic', label: 'Italic' },
		{ value: 'oblique', label: 'Oblique' },
	];
	/**
	 * Default decoration options
	 */
	const defcorationVariationOptions = [
		{ value: 'none', label: 'Default' },
		{ value: 'overline', label: 'Overline' },
		{ value: 'underline', label: 'Underline' },
		{ value: 'line-through', label: 'Line Through' },
	];
	/**
	 * Default transform options
	 */
	const transformVariationOptions = [
		{ value: 'none', label: 'Default' },
		{ value: 'capitalize', label: 'Capitalize' },
		{ value: 'uppercase', label: 'Uppercase' },
		{ value: 'lowercase', label: 'Lowercase' },
	];
	/**
	 * Handle color change and set attributes value
	 * @param {*} attrName string
	 * @returns
	 */
	const handleSelectControl = (attrName) => {
		return (newValue) => {
			setAttributes({
				[attrName]: newValue,
			});
		};
	};
	const [isVisible, setIsVisible] = useState(false);
	const toggleVisible = () => {
		setIsVisible((state) => !state);
	};

	return (
		<div className="gts__typography-panel">
			<Flex>
				<FlexItem>
					<strong>Typography</strong>
					{/* <GrayBox>Typography</GrayBox> */}
				</FlexItem>
				<FlexItem>
					<button
						className="components-button is-primary"
						onClick={toggleVisible}
					>
						{isVisible ? (
							<Icon icon={settings} />
						) : (
							<Icon icon={typography} />
							// <Icon icon={arrowRight} />
						)}
					</button>
				</FlexItem>
			</Flex>
			{isVisible && (
				<div
					style={{
						background: '#f0f0f0',
						padding: '15px',
						marginTop: '15px',
					}}
				>
					<SelectControl
						label={__('Font Weight')}
						options={fontWeightVariationOptions}
						value={attributes[textFontWeightAttr]}
						onChange={handleSelectControl(textFontWeightAttr)}
					/>
					<FontSizePicker
						fontSizes={fontSizes}
						value={attributes[textFontSizeAttr]}
						fallbackFontSize={fallbackFontSize}
						withReset={true}
						withSlider={true}
						// units={['px', 'em', 'rem']}
						onChange={(titleFontSize) => {
							setAttributes({
								[textFontSizeAttr]: titleFontSize,
							});
						}}
					/>
					<RangeControl
						__nextHasNoMarginBottom={true}
						label="Letter Spacing"
						value={attributes[textLetterSpacingAttr]}
						onChange={(value) =>
							setAttributes({
								[textLetterSpacingAttr]: value,
							})
						}
						min={1}
						max={10}
						allowReset={true}
						step={0.1}
					/>
					<RangeControl
						__nextHasNoMarginBottom={true}
						label="Line Height"
						value={attributes[textLineHeightAttr]}
						onChange={(value) =>
							setAttributes({
								[textLineHeightAttr]: value,
							})
						}
						min={1}
						max={10}
						allowReset={true}
						step={0.1}
					/>
					<SelectControl
						label={__('Style')}
						value={attributes[textStyleAttr]}
						options={styleVariationOptions}
						onChange={handleSelectControl(textStyleAttr)}
					/>
					<SelectControl
						label={__('Decoration')}
						value={attributes[textDecorationAttr]}
						options={defcorationVariationOptions}
						onChange={handleSelectControl(textDecorationAttr)}
					/>
					<SelectControl
						label={__('Transform')}
						value={attributes[textTransformAttr]}
						options={transformVariationOptions}
						onChange={handleSelectControl(textTransformAttr)}
					/>
				</div>
			)}
			{/* <SelectControl
				label={__('Font Weight')}
				options={fontWeightVariationOptions}
				value={attributes[textFontWeightAttr]}
				onChange={handleSelectControl(textFontWeightAttr)}
			/>
			<FontSizePicker
				fontSizes={fontSizes}
				value={attributes[textFontSizeAttr]}
				fallbackFontSize={fallbackFontSize}
				withReset={true}
				withSlider={true}
				// units={['px', 'em', 'rem']}
				onChange={(titleFontSize) => {
					setAttributes({
						[textFontSizeAttr]: titleFontSize,
					});
				}}
			/> */}
			{/* <RangeControl
				__nextHasNoMarginBottom={true}
				label="Letter Spacing"
				value={attributes[textLetterSpacingAttr]}
				onChange={(value) =>
					setAttributes({
						[textLetterSpacingAttr]: value,
					})
				}
				min={1}
				max={10}
				allowReset={true}
				step={0.1}
			/>
			<RangeControl
				__nextHasNoMarginBottom={true}
				label="Line Height"
				value={attributes[textLineHeightAttr]}
				onChange={(value) =>
					setAttributes({
						[textLineHeightAttr]: value,
					})
				}
				min={1}
				max={10}
				allowReset={true}
				step={0.1}
			/>
			<SelectControl
				label={__('Style')}
				value={attributes[textStyleAttr]}
				options={styleVariationOptions}
				onChange={handleSelectControl(textStyleAttr)}
			/>
			<SelectControl
				label={__('Decoration')}
				value={attributes[textDecorationAttr]}
				options={defcorationVariationOptions}
				onChange={handleSelectControl(textDecorationAttr)}
			/>
			<SelectControl
				label={__('Transform')}
				value={attributes[textTransformAttr]}
				options={transformVariationOptions}
				onChange={handleSelectControl(textTransformAttr)}
			/> */}
		</div>
	);
}
