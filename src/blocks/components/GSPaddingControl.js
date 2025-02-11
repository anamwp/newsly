import React from 'react';
import { __ } from '@wordpress/i18n';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';

import {
	Flex,
	FlexItem,
	BoxControl,
	__experimentalSpacer as Spacer,
} from '@wordpress/components';
import { Icon, settings, sidesAll } from '@wordpress/icons';

/**
 * How to use this component
 * =========================
 * import SpacingControl from '../components/SpacingControl';
 * <SpacingControl attributes={attributes} setAttributes={setAttributes} paddingAttr = "titlePaddingAttr" />
 * [paddingAttr] = Padding attributes name from block json file
 * How to implement in the edit or save file
 * =========================
 * style={{
	padding: `${attributes.contentPaddingAttr.top} ${attributes.contentPaddingAttr.right} ${attributes.contentPaddingAttr.bottom} ${attributes.contentPaddingAttr.left}`,
}}
 * 
 */

/**
 * GSPaddingControl Component
 *
 * @param {object} attributes
 * @param {function} setAttributes
 * @param {object} paddingAttr
 * @returns HTML
 */
export default function GSPaddingControl({
	attributes,
	setAttributes,
	paddingAttr,
}) {
	const [isVisible, setIsVisible] = useState(false);
	const toggleVisible = () => {
		setIsVisible((prevState) => !prevState);
	};
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
	debugger;
	return (
		<div className="gts__spacing-control-panel">
			<style>
				{`.gts__spacing-control-panel .components-base-control{
						margin-bottom: 0px;
					}`}
			</style>

			<Flex>
				<FlexItem>
					<strong>Padding</strong>
				</FlexItem>
				<FlexItem>
					<button
						className="components-button is-primary"
						onClick={toggleVisible}
					>
						{isVisible ? (
							<Icon icon={settings} />
						) : (
							<Icon icon={sidesAll} />
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
		</div>
	);
}
