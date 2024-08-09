import React from 'react';
import { __ } from '@wordpress/i18n';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';
import {
	TabPanel,
	ColorPicker,
	ColorPalette,
	ColorIndicator,
	GradientPicker,
} from '@wordpress/components';

export default function TabPanelForHeadingColor({
	attributes,
	setAttributes,
	textColorAttribute,
	linkColorAttribute,
	linkHoverColorAttribute,
}) {
	/**
	 * Set default color options
	 */
	const colors = [
		{ name: 'red', color: 'var(--wp--preset--color--light-green-cyan)' },
		{ name: 'white', color: '#fff' },
		{ name: 'blue', color: '#00f' },
	];
	/**
	 * Handle on Selections tabs
	 * @param {*} tabName
	 */
	const onSelect = (tabName) => {
		console.log('Selecting tab', tabName);
	};
	/**
	 * Handle color change and set attributes value
	 * @param {*} attrName
	 * @returns
	 */
	const handleColorChange = (attrName) => {
		return (color) => {
			setAttributes({
				[attrName]: color,
			});
		};
	};
	/**
	 * Color picker component
	 * @param {*} param0
	 * @returns
	 */
	const HandleColorPanel = ({ attributeValue, attributeName }) => {
		console.log(attributeValue, attributeName);
		return (
			<ColorPalette
				colors={colors}
				value={attributeValue}
				// asButtons={true}
				__experimentalIsRenderedInSidebar={true}
				onChange={handleColorChange(attributeName)}
			/>
		);
	};
	return (
		<TabPanel
			className="my-tab-panel"
			activeClass="active-tab active bg-violet-700 components-button is-primary"
			onSelect={onSelect}
			tabs={[
				{
					name: 'text-color',
					title: 'Text',
					className: 'text-color',
					content: (
						<HandleColorPanel
							attributeValue={attributes[textColorAttribute]}
							attributeName={textColorAttribute}
						/>
					),
				},
				{
					name: 'link-color',
					title: 'Link',
					className: 'link-color',
					content: (
						<HandleColorPanel
							attributeValue={attributes[linkColorAttribute]}
							attributeName={linkColorAttribute}
						/>
					),
				},
				{
					name: 'link-hover-color',
					title: 'Link Hover',
					className: 'link-hover-color',
					content: (
						<HandleColorPanel
							attributeValue={attributes[linkHoverColorAttribute]}
							attributeName={linkHoverColorAttribute}
						/>
					),
				},
			]}
		>
			{({ title, className, content }) => (
				<div className={className}>
					{/* <strong>{title}</strong> */}
					{content}
				</div>
			)}
		</TabPanel>
	);
}
