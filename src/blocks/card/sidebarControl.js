import { __ } from '@wordpress/i18n';
import React from 'react';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';
import { useSelect, withSelect, select } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import TabPanelForTextAndLink from '../components/TabPanelForTextAndLink';
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

export default function sidebarControl({ props }) {
	const { attributes, setAttributes } = props;
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
					<PanelBody initialOpen={true} title="Heading">
						{/* <PanelRow>My Panel Inputs and Labels</PanelRow> */}
						<TabPanelForTextAndLink
							attributes={attributes}
							setAttributes={setAttributes}
							textColorAttribute="headingColor"
							linkColorAttribute="linkColor"
							linkHoverColorAttribute="linkHoverColor"
						/>
					</PanelBody>
					<PanelBody initialOpen={false} title="Content">
						{/* <PanelRow>My Panel Inputs and Labels</PanelRow> */}
						<TabPanelForTextAndLink
							attributes={attributes}
							setAttributes={setAttributes}
							textColorAttribute="contentColor"
							linkColorAttribute="contentLinkColor"
							linkHoverColorAttribute="contentLinkHoverColor"
						/>
					</PanelBody>
				</Panel>
			</InspectorControls>
		</div>
	);
}
