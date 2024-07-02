import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	FontSizePicker,
	Panel,
	PanelRow,
} from '@wordpress/components';
import React from 'react';

export default function sidebarControl({ props }) {
	const { attributes, setAttributes } = props;
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
		</div>
	);
}
