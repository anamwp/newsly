import { __ } from '@wordpress/i18n';
import { useSelect, withSelect, select } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import {
	Panel,
	PanelBody,
	PanelRow,
	SelectControl,
	ToggleControl,
	TabPanel,
	ColorPicker,
	DateTimePicker,
	ColorPalette,
	ColorIndicator,
	Button,
	FontSizePicker,
	ButtonGroup,
	CheckboxControl,
	ClipboardButton,
	GradientPicker,
	__experimentalBoxControl as BoxControl,
	__experimentalBorderControl as BorderControl,
	__experimentalBorderBoxControl as BorderBoxControl,
} from '@wordpress/components';
import React from 'react';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';

export default function sidebarControl({ props }) {
	const { attributes, setAttributes } = props;
	const [hasFixedBg, setHasFixedBg] = useState(false);
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
	const fallbackFontSize = 26;
	const colors = [
		{ name: 'red', color: 'var(--wp--preset--color--light-green-cyan)' },
		{ name: 'white', color: '#fff' },
		{ name: 'blue', color: '#00f' },
	];
	const onSelect = (tabName) => {
		console.log('Selecting tab', tabName);
	};
	const MyCustomTabContent = () => {
		return (
			<ColorPalette
				colors={colors}
				value={attributes.contentColor}
				// asButtons={true}
				__experimentalIsRenderedInSidebar={true}
				onChange={(contentColor) => {
					setAttributes({
						contentColor: contentColor,
					});
				}}
			/>
		);
	};
	const TextColorPanel = () => {
		return (
			<ColorPalette
				colors={colors}
				value={attributes.headingColor}
				// asButtons={true}
				__experimentalIsRenderedInSidebar={true}
				onChange={(headingColor) => {
					setAttributes({
						headingColor: headingColor,
					});
				}}
			/>
		);
	};

	console.log('attributes', attributes);
	return (
		<div>
			<InspectorControls>
				<Panel>
					<PanelBody
						title={__('Title', 'anam-gutenberg-starter')}
						initialOpen={true}
					>
						<PanelRow>Choose Title Font Size</PanelRow>
						<FontSizePicker
							fontSizes={fontSizes}
							value={attributes.titleFontSize}
							fallbackFontSize={fallbackFontSize}
							// withReset={true}
							withSlider={true}
							onChange={(titleFontSize) => {
								setAttributes({
									titleFontSize: titleFontSize,
								});
							}}
						/>
					</PanelBody>
				</Panel>
				<Panel>
					<PanelBody
						initialOpen={false}
						title={__('Content', 'anam-gutenberg-starter')}
					>
						<PanelRow>Choose Content Font Size</PanelRow>
						<FontSizePicker
							fontSizes={fontSizes}
							value={attributes.contentFontSize}
							fallbackFontSize={fallbackFontSize}
							onChange={(contentFontSize) => {
								setAttributes({
									contentFontSize: contentFontSize,
								});
							}}
						/>
					</PanelBody>
				</Panel>
			</InspectorControls>
			<InspectorControls group="styles">
				<Panel>
					<PanelBody initialOpen={true} title="Color">
						{/* <PanelRow>My Panel Inputs and Labels</PanelRow> */}
						{/* <ColorPalette
							colors={colors}
							value={attributes.headingColor}
							// asButtons={true}
							__experimentalIsRenderedInSidebar={true}
							onChange={(headingColor) => {
								setAttributes({
									headingColor: headingColor,
								});
							}}
						/> */}
						<TabPanel
							className="my-tab-panel"
							activeClass="active-tab active bg-violet-700"
							onSelect={onSelect}
							tabs={[
								{
									name: 'card-heading-color',
									title: 'Heading',
									className: 'card-heading-color',
									content: <TextColorPanel />,
								},
								{
									name: 'card-content-color',
									title: 'Content',
									className: 'card-content-color',
									content: <MyCustomTabContent />,
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
					</PanelBody>
				</Panel>
			</InspectorControls>
		</div>
	);
}
