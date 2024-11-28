import React from 'react';
import { __ } from '@wordpress/i18n';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';

import {
	SelectControl,
	FontSizePicker,
	RangeControl,
	Button,
	Popover,
	Dropdown,
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Flex,
	FlexItem,
	DimensionControl,
	BoxControl,
	Spacer,
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
	sidesAxial,
	sidesAll,
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
 * @param {object} attributes
 * @param {function} setAttributes
 * @param {string} textFontWeightAttr
 * @param {number} textFontSizeAttr
 * @param {number} textLetterSpacingAttr
 * @param {number} textLineHeightAttr
 * @param {string} textStyleAttr
 * @param {string} textDecorationAttr
 * @param {string} textTransformAttr
 * @returns HTML
 */

export default function SpacingControl({
	attributes,
	setAttributes,
	paddingAttr,
}) {
	const [paddingSize, setPaddingSize] = useState('');
	const buttonRef = useRef();

	const [values, setValues] = useState({
		top: '0px',
		left: '0px',
		right: '0px',
		bottom: '0px',
	});
	const [popoverAnchor, setPopoverAnchor] = useState();

	const [isVisible, setIsVisible] = useState(false);
	const toggleVisible = () => {
		setIsVisible((state) => !state);
	};
	// const [values, setValues] = useState();
	// console.log('values', values);

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

	console.log('paddingAttr from component', attributes[paddingAttr]);
	return (
		<div class="gts__spacing-control-panel">
			<style>
				{`.gts__spacing-control-panel .components-base-control{
						margin-bottom: 0px;
					}`}
			</style>

			<Flex>
				<FlexItem>
					<strong>Padding</strong>
					{/* <GrayBox>Typography</GrayBox> */}
				</FlexItem>
				<FlexItem>
					<button
						class="components-button is-primary"
						onClick={toggleVisible}
					>
						{isVisible ? (
							<Icon icon={settings} />
						) : (
							// <Icon icon={sidesAxial} />
							<Icon icon={sidesAll} />
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
					<BoxControl
						label=""
						// units={['px', '%', 'em', 'rem']}
						// units={['px']}
						values={attributes[paddingAttr]}
						onChange={handleSelectControl(paddingAttr)}
						// values={values}
						// onChange={(nextValues) => setValues(nextValues)}
						allowReset={true}
					/>
					<Spacer marginBottom="20px" />
				</div>
			)}

			{/* 
			Return Object
			*/}
			{/* <p ref={setPopoverAnchor}></p> */}
			{/* <BoxControl
				label="Card Padding"
				// units={['px', '%', 'em', 'rem']}
				units={['px']}
				values={values}
				onChange={(nextValues) => setValues(nextValues)}
				allowReset={true}
			/> */}
			{/* <Spacer marginBottom="20px" /> */}
			{/* <p ref={setPopoverAnchor}>Popover s anchor</p> */}
			{/* <Button variant="secondary" onClick={toggleVisible}>
				1 Toggle Popover!
			</Button> */}
			{/* {isVisible && (
				<Popover
					anchor={buttonRef.current}
					animated={true}
					// variant="toolbar"
					// offset={100}
				>
					<MenuGroup>
						<MenuItem>Item 1</MenuItem>
						<MenuItem>Popover is toggled!</MenuItem>
					</MenuGroup>
				</Popover>
			)} */}

			{/* <Spacer marginBottom="20px" /> */}

			{/* <DimensionControl
				// __nextHasNoMarginBottom
				label={'Padding'}
				icon={'desktop'}
				onChange={(value) => setPaddingSize(value)}
				value={paddingSize}
				__next40pxDefaultSize
			/> */}
		</div>
	);
}
